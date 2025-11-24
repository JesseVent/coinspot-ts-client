"use strict";
/**
 * CoinSpot schema probe helper (using coinspot-ts-client).
 *
 * Usage (safe default set):
 *   COINSPOT_API_KEY=... COINSPOT_API_SECRET=... npx ts-node scripts/coinspot_probe.ts
 *
 * Select endpoints:
 *   COINSPOT_API_KEY=... COINSPOT_API_SECRET=... npx ts-node scripts/coinspot_probe.ts latest balances buyQuote sellQuote
 *
 * Risky calls (executes $5 AUD buy/sell) require ALLOW_RISKY=true:
 *   ALLOW_RISKY=true COINSPOT_API_KEY=... COINSPOT_API_SECRET=... npx ts-node scripts/coinspot_probe.ts buyNow5 sellNow5
 *
 * Env overrides: COIN=BTC, MARKET=AUD, AUD_AMOUNT=5
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
const promises_2 = __importDefault(require("node:readline/promises"));
const node_process_1 = require("node:process");
const client_1 = require("../client");
const key = process.env.COINSPOT_API_KEY || process.env.COINSPOT_API_KEY;
const secret = process.env.COINSPOT_API_SECRET || process.env.COINSPOT_API_SECRET;
const coin = process.env.COIN || "SOUL";
const market = process.env.MARKET || "usdt";
const audAmount = Number(process.env.AUD_AMOUNT || process.env.AMOUNT || "5");
let allowRisky = process.env.ALLOW_RISKY === "true";
const outDir = node_path_1.default.resolve(process.env.PROBE_OUT_DIR || "./probe_output");
if (!key || !secret) {
    console.error("Set COINSPOT_API_KEY/COINSPOT_API_SECRET (or COINSPOT_API_KEY/COINSPOT_API_SECRET) in env.");
    process.exit(1);
}
const client = new client_1.CoinspotClient({
    fullAccess: { key, secret },
    readOnly: { key, secret },
});
const targets = {
    // Public
    latest: { run: () => client.public.ticker24hr() },
    latestCoin: {
        request: { cointype: coin },
        run: () => client.public.ticker24hrForSymbol(coin),
    },
    latestCoinMarket: {
        request: { cointype: coin, markettype: market },
        run: () => client.public.ticker24hrForMarket(coin, market),
    },
    buyPrice: {
        request: { cointype: coin },
        run: () => client.public.avgPrice(coin),
    },
    sellPrice: {
        request: { cointype: coin },
        run: () => client.public.bookTickerBid(coin),
    },
    // Read-only
    roStatus: { run: () => client.readOnly.account() },
    balances: { run: () => client.readOnly.accountBalances() },
    balanceCoin: {
        run: () => client.readOnly.assetBalance({ cointype: coin, available: true }),
    },
    marketOpen: {
        request: { cointype: coin, markettype: market },
        run: withMarketFallback(() => client.readOnly.marketDepth({ cointype: coin, markettype: market }), () => client.readOnly.marketDepth({ cointype: coin, markettype: "btc" })),
    },
    marketCompleted: {
        request: { cointype: coin, markettype: market, limit: 5 },
        run: withMarketFallback(() => client.readOnly.marketTrades({
            cointype: coin,
            markettype: market,
            limit: 5,
        }), () => client.readOnly.marketTrades({
            cointype: coin,
            markettype: "btc",
            limit: 5,
        })),
    },
    myOpenMarket: {
        request: { cointype: coin },
        run: () => client.readOnly.openMarketOrders({ cointype: coin }),
    },
    myOpenLimit: {
        request: { cointype: coin },
        run: () => client.readOnly.openLimitOrders({ cointype: coin }),
    },
    myHistory: {
        request: { cointype: coin, limit: 5 },
        run: () => client.readOnly.allOrders({ cointype: coin, limit: 5 }),
    },
    myMarketHistory: {
        request: { cointype: coin, limit: 5 },
        run: () => client.readOnly.allMarketOrders({ cointype: coin, limit: 5 }),
    },
    // Full access (non-mutating)
    status: { run: () => client.fullAccess.account() },
    depositAddr: {
        request: { cointype: coin },
        run: () => client.fullAccess.capitalDepositAddress(coin),
    },
    buyQuote: {
        request: { cointype: coin, amount: audAmount, amounttype: "aud" },
        run: () => client.fullAccess.orderQuoteBuy(coin, audAmount, "aud"),
    },
    sellQuote: {
        request: { cointype: coin, amount: audAmount, amounttype: "aud" },
        run: () => client.fullAccess.orderQuoteSell(coin, audAmount, "aud"),
    },
    swapQuote: {
        request: {
            cointypesell: coin,
            cointypebuy: "MNT",
            amount: audAmount,
            amounttype: "aud",
        },
        run: () => client.fullAccess.orderQuoteSwap("BTC", "MNT", audAmount),
    },
    swapNow5: {
        risky: true,
        request: { cointypesell: coin, cointypebuy: "MNT", amountAud: audAmount },
        run: async () => {
            const sellPrice = await client.public.bookTickerBid(coin);
            const rate = Number(sellPrice.rate);
            if (!rate || Number.isNaN(rate))
                throw new Error("Could not fetch sell price for swap sizing");
            const amountCoin = Number((audAmount / rate).toFixed(8)); // sell ~AUD_AMOUNT worth of coin
            return client.fullAccess.orderSwapNow({
                cointypesell: coin,
                cointypebuy: "MNT",
                amount: amountCoin,
            });
        },
    },
    // Risky (executes $ amount)
    buyNow5: {
        risky: true,
        request: { cointype: coin, amounttype: "aud", amount: audAmount },
        run: () => client.fullAccess.orderMarketBuyNow({
            cointype: coin,
            amounttype: "aud",
            amount: audAmount,
        }),
    },
    sellNow5: {
        risky: true,
        request: { cointype: coin, amounttype: "aud", amount: audAmount },
        run: () => client.fullAccess.orderMarketSellNow({
            cointype: coin,
            amounttype: "aud",
            amount: audAmount,
        }),
    },
    marketBuy: {
        risky: true,
        request: {
            cointype: coin,
            amount: audAmount,
            markettype: market,
            rate: "0.95x sellPrice",
        },
        run: async () => {
            const marketLower = market.toLowerCase();
            const useAltMarket = marketLower !== "aud";
            const sellQuote = useAltMarket
                ? await client.public.bookTickerBidForMarket(coin, marketLower)
                : await client.public.bookTickerBid(coin);
            const rate = Number(sellQuote.rate) * 0.95; // 5% below current sell price to stay open
            const coinAmount = Number((audAmount / rate).toFixed(8));
            return client.fullAccess.createOrderBuy({
                cointype: coin,
                amount: coinAmount,
                rate,
                markettype: useAltMarket ? marketLower : undefined,
            });
        },
    },
    marketSell: {
        risky: true,
        request: {
            cointype: coin,
            amount: audAmount,
            markettype: market,
            rate: "1.05x buyPrice",
        },
        run: async () => {
            const marketLower = market.toLowerCase();
            const useAltMarket = marketLower !== "aud";
            const buyQuote = useAltMarket
                ? await client.public.avgPriceForMarket(coin, marketLower)
                : await client.public.avgPrice(coin);
            const rate = Number(buyQuote.rate) * 1.05; // 5% above current buy price to stay open
            const coinAmount = Number((audAmount / rate).toFixed(8));
            return client.fullAccess.createOrderSell({
                cointype: coin,
                amount: coinAmount,
                rate,
                markettype: useAltMarket ? marketLower : undefined,
            });
        },
    },
    cancelBuy: {
        risky: true,
        request: { id: "<buy order id>" },
        run: async () => {
            // Cancel the first open buy order if present
            const open = await client.readOnly.openMarketOrders({ cointype: coin });
            const id = open.buyorders?.[0]?.id;
            if (!id)
                throw new Error("No open buy orders to cancel");
            return client.fullAccess.cancelOrderBuy(id);
        },
    },
    cancelSell: {
        risky: true,
        request: { id: "<sell order id>" },
        run: async () => {
            // Cancel the first open sell order if present
            const open = await client.readOnly.openMarketOrders({ cointype: coin });
            const id = open.sellorders?.[0]?.id;
            if (!id)
                throw new Error("No open sell orders to cancel");
            return client.fullAccess.cancelOrderSell(id);
        },
    },
    editBuy: {
        risky: true,
        request: { id: "<buy order id>", rate: "rate * 0.97" },
        run: async () => {
            const open = await client.readOnly.openMarketOrders({ cointype: coin });
            const order = open.buyorders?.[0];
            if (!order?.id || order.rate === undefined)
                throw new Error("No open buy orders to edit");
            const newrate = Number(order.rate) * 0.97; // drop 3% to keep it resting
            return client.fullAccess.updateOrderBuy({
                cointype: coin,
                id: order.id,
                rate: Number(order.rate),
                newrate,
            });
        },
    },
    editSell: {
        risky: true,
        request: { id: "<sell order id>", rate: "rate * 1.03" },
        run: async () => {
            const open = await client.readOnly.openMarketOrders({ cointype: coin });
            const order = open.sellorders?.[0];
            if (!order?.id || order.rate === undefined)
                throw new Error("No open sell orders to edit");
            const newrate = Number(order.rate) * 1.03; // bump 3% to keep it resting
            return client.fullAccess.updateOrderSell({
                cointype: coin,
                id: order.id,
                rate: Number(order.rate),
                newrate,
            });
        },
    },
    cancelBuyAll: {
        risky: true,
        request: { cointype: coin },
        run: () => client.fullAccess.cancelOpenOrdersBuy({ coin }),
    },
    cancelSellAll: {
        risky: true,
        request: { cointype: coin },
        run: () => client.fullAccess.cancelOpenOrdersSell({ coin }),
    },
};
function shape(value, depth = 0) {
    const indent = "  ".repeat(depth);
    if (depth > 2)
        return `${indent}…`;
    if (Array.isArray(value)) {
        if (value.length === 0)
            return `${indent}array(empty)`;
        return `${indent}array(len=${value.length})\n${shape(value[0], depth + 1)}`;
    }
    if (value && typeof value === "object") {
        const lines = Object.entries(value).map(([k, v]) => `${indent}${k}: ${typeof v}`);
        return [`${indent}object`, ...lines].join("\n");
    }
    return `${indent}${typeof value}`;
}
function withMarketFallback(runner, fallback) {
    return async () => {
        try {
            return await runner();
        }
        catch (err) {
            if (err instanceof client_1.CoinspotHttpError && err.statusCode === 400) {
                return fallback();
            }
            throw err;
        }
    };
}
async function main() {
    const rawArgs = process.argv.slice(2);
    const interactive = rawArgs.includes("--interactive") || rawArgs.includes("-i");
    const selection = rawArgs.filter((a) => a !== "--interactive" && a !== "-i");
    const defaultSet = [
        "latest",
        "roStatus",
        "balances",
        "balanceCoin",
        "marketOpen",
        "status",
        "depositAddr",
        "buyQuote",
        "sellQuote",
    ];
    let chosen = selection.length ? selection : defaultSet;
    if (interactive) {
        const rl = promises_2.default.createInterface({ input: node_process_1.stdin, output: node_process_1.stdout });
        const list = Object.keys(targets).join(", ");
        const answer = await rl.question(`Targets (comma, 'default', or 'all') [default=${defaultSet.join(",")}]:\n${list}\n> `);
        const raw = answer.trim();
        if (raw === "all")
            chosen = Object.keys(targets);
        else if (raw && raw !== "default")
            chosen = raw.split(/[,\\s]+/).filter(Boolean);
        if (!allowRisky) {
            const riskyAns = await rl.question("Allow risky endpoints (buy/sell execution)? (y/N): ");
            allowRisky = riskyAns.trim().toLowerCase().startsWith("y");
        }
        await rl.close();
    }
    await promises_1.default.mkdir(outDir, { recursive: true });
    for (const name of chosen) {
        const target = targets[name];
        if (!target) {
            console.warn(`Unknown target: ${name}`);
            continue;
        }
        if (target.risky && !allowRisky) {
            console.warn(`Skipping risky target ${name} (set ALLOW_RISKY=true to enable)`);
            continue;
        }
        try {
            const result = await target.run();
            console.log(`\n=== ${name} ===`);
            console.log("shape:\n" + shape(result));
            console.log("sample:", JSON.stringify(result, null, 2).slice(0, 2000));
            const record = {
                name,
                timestamp: new Date().toISOString(),
                coin,
                market,
                audAmount,
                risky: !!target.risky,
                request: target.request ?? null,
                response: result,
            };
            const file = node_path_1.default.join(outDir, `${Date.now()}_${name}.json`);
            await promises_1.default.writeFile(file, JSON.stringify(record, null, 2), "utf8");
            console.log(`saved -> ${file}`);
        }
        catch (err) {
            const error = err;
            const isHttp = error instanceof client_1.CoinspotHttpError;
            const isUnsupportedPair = isHttp && error.statusCode === 400;
            const message = isUnsupportedPair
                ? `Skipping ${name}: pair not available on CoinSpot (400)`
                : `Error on ${name}: ${error.message}`;
            console.warn(message);
            const errorRecord = {
                name,
                timestamp: new Date().toISOString(),
                coin,
                market,
                audAmount,
                risky: !!target.risky,
                request: target.request ?? null,
                error: {
                    message: error.message,
                    statusCode: isHttp ? error.statusCode : undefined,
                    responseText: isHttp ? error.responseText : undefined,
                },
            };
            const file = node_path_1.default.join(outDir, `${Date.now()}_${name}_error.json`);
            await promises_1.default.writeFile(file, JSON.stringify(errorRecord, null, 2), "utf8");
            console.log(`saved -> ${file}`);
        }
    }
}
main();
