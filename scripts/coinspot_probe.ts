/**
 * CoinSpot schema probe helper (using coinspot-ts-client).
 *
 * Usage (safe default set):
 *   COINSPOT_KEY=... COINSPOT_SECRET=... npx ts-node scripts/coinspot_probe.ts
 *
 * Select endpoints:
 *   COINSPOT_KEY=... COINSPOT_SECRET=... npx ts-node scripts/coinspot_probe.ts latest balances buyQuote sellQuote
 *
 * Risky calls (executes $5 AUD buy/sell) require ALLOW_RISKY=true:
 *   ALLOW_RISKY=true COINSPOT_KEY=... COINSPOT_SECRET=... npx ts-node scripts/coinspot_probe.ts buyNow5 sellNow5
 *
 * Env overrides: COIN=BTC, MARKET=AUD, AUD_AMOUNT=5
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { CoinspotClient } from '../client';

const key = process.env.COINSPOT_KEY || process.env.COINSPOT_API_KEY;
const secret = process.env.COINSPOT_SECRET || process.env.COINSPOT_API_SECRET;
const coin = process.env.COIN || 'BTC';
const market = process.env.MARKET || 'AUD';
const audAmount = Number(process.env.AUD_AMOUNT || process.env.AMOUNT || '5');
let allowRisky = process.env.ALLOW_RISKY === 'true';
const outDir = path.resolve(process.env.PROBE_OUT_DIR || './probe_output');

if (!key || !secret) {
  console.error('Set COINSPOT_KEY/COINSPOT_SECRET (or COINSPOT_API_KEY/COINSPOT_API_SECRET) in env.');
  process.exit(1);
}

const client = new CoinspotClient({
  fullAccess: { key, secret },
  readOnly: { key, secret },
});

type Target = { risky?: boolean; request?: Record<string, unknown>; run: () => Promise<unknown> };

const targets: Record<string, Target> = {
  // Public
  latest: { run: () => client.public.getLatestPrices() },
  latestCoin: { request: { cointype: coin }, run: () => client.public.getLatestPricesForCoin(coin) },
  latestCoinMarket: {
    request: { cointype: coin, markettype: market },
    run: () => client.public.getLatestPricesForCoinMarket(coin, market),
  },
  buyPrice: { request: { cointype: coin }, run: () => client.public.getLatestBuyPrice(coin) },
  sellPrice: { request: { cointype: coin }, run: () => client.public.getLatestSellPrice(coin) },

  // Read-only
  roStatus: { run: () => client.readOnly.getStatus() },
  balances: { run: () => client.readOnly.getBalances() },
  balanceCoin: { run: () => client.readOnly.getBalanceForCoin({ cointype: coin, available: true }) },
  marketOpen: {
    request: { cointype: coin, markettype: market },
    run: () => client.readOnly.getMarketOpenOrders({ cointype: coin, markettype: market }),
  },
  marketCompleted: {
    request: { cointype: coin, markettype: market, limit: 5 },
    run: () =>
      client.readOnly.getMarketCompletedOrders({ cointype: coin, markettype: market, limit: 5 }),
  },
  myOpenMarket: { request: { cointype: coin }, run: () => client.readOnly.getMyOpenMarketOrders({ cointype: coin }) },
  myOpenLimit: { request: { cointype: coin }, run: () => client.readOnly.getMyOpenLimitOrders({ cointype: coin }) },
  myHistory: { request: { cointype: coin, limit: 5 }, run: () => client.readOnly.getMyOrdersHistory({ cointype: coin, limit: 5 }) },
  myMarketHistory: {
    request: { cointype: coin, limit: 5 },
    run: () => client.readOnly.getMyMarketOrdersHistory({ cointype: coin, limit: 5 }),
  },

  // Full access (non-mutating)
  status: { run: () => client.fullAccess.getStatus() },
  depositAddr: { request: { cointype: coin }, run: () => client.fullAccess.getDepositAddresses(coin) },
  buyQuote: {
    request: { cointype: coin, amount: audAmount, amounttype: 'aud' },
    run: () => client.fullAccess.getBuyNowQuote(coin, audAmount, 'aud'),
  },
  sellQuote: {
    request: { cointype: coin, amount: audAmount, amounttype: 'aud' },
    run: () => client.fullAccess.getSellNowQuote(coin, audAmount, 'aud'),
  },
  swapQuote: {
    request: { cointypesell: coin, cointypebuy: 'MNT', amount: audAmount, amounttype: 'aud' },
    run: () => client.fullAccess.getSwapNowQuote('BTC', 'MNT', audAmount),
  },
  swapNow5: {
    risky: true,
    request: { cointypesell: coin, cointypebuy: 'MNT', amountAud: audAmount },
    run: async () => {
      const sellPrice = await client.public.getLatestSellPrice(coin);
      const rate = Number(sellPrice.rate);
      if (!rate || Number.isNaN(rate)) throw new Error('Could not fetch sell price for swap sizing');
      const amountCoin = Number((audAmount / rate).toFixed(8)); // sell ~AUD_AMOUNT worth of coin
      return client.fullAccess.placeSwapNowOrder({
        cointypesell: coin,
        cointypebuy: 'MNT',
        amount: amountCoin,
      });
    },
  },

  // Risky (executes $ amount)
  buyNow5: {
    risky: true,
    request: { cointype: coin, amounttype: 'aud', amount: audAmount },
    run: () => client.fullAccess.placeBuyNowOrder({ cointype: coin, amounttype: 'aud', amount: audAmount }),
  },
  sellNow5: {
    risky: true,
    request: { cointype: coin, amounttype: 'aud', amount: audAmount },
    run: () => client.fullAccess.placeSellNowOrder({ cointype: coin, amounttype: 'aud', amount: audAmount }),
  },
  marketBuy: {
    risky: true,
    request: { cointype: coin, amount: audAmount, markettype: market, rate: '0.95x sellPrice' },
    run: async () => {
      const marketLower = market.toLowerCase();
      const useAltMarket = marketLower !== 'aud';
      const sellQuote = useAltMarket
        ? await client.public.getLatestSellPriceInMarket(coin, marketLower)
        : await client.public.getLatestSellPrice(coin);
      const rate = Number(sellQuote.rate) * 0.95; // 5% below current sell price to stay open
      const coinAmount = Number((audAmount / rate).toFixed(8));
      return client.fullAccess.placeMarketBuyOrder({
        cointype: coin,
        amount: coinAmount,
        rate,
        markettype: useAltMarket ? marketLower : undefined,
      });
    },
  },
  marketSell: {
    risky: true,
    request: { cointype: coin, amount: audAmount, markettype: market, rate: '1.05x buyPrice' },
    run: async () => {
      const marketLower = market.toLowerCase();
      const useAltMarket = marketLower !== 'aud';
      const buyQuote = useAltMarket
        ? await client.public.getLatestBuyPriceInMarket(coin, marketLower)
        : await client.public.getLatestBuyPrice(coin);
      const rate = Number(buyQuote.rate) * 1.05; // 5% above current buy price to stay open
      const coinAmount = Number((audAmount / rate).toFixed(8));
      return client.fullAccess.placeMarketSellOrder({
        cointype: coin,
        amount: coinAmount,
        rate,
        markettype: useAltMarket ? marketLower : undefined,
      });
    },
  },
  cancelBuy: {
    risky: true,
    request: { id: '<buy order id>' },
    run: async () => {
      // Cancel the first open buy order if present
      const open = await client.readOnly.getMyOpenMarketOrders({ cointype: coin });
      const id = open.buyorders?.[0]?.id;
      if (!id) throw new Error('No open buy orders to cancel');
      return client.fullAccess.cancelBuyOrder(id);
    },
  },
  cancelSell: {
    risky: true,
    request: { id: '<sell order id>' },
    run: async () => {
      // Cancel the first open sell order if present
      const open = await client.readOnly.getMyOpenMarketOrders({ cointype: coin });
      const id = open.sellorders?.[0]?.id;
      if (!id) throw new Error('No open sell orders to cancel');
      return client.fullAccess.cancelSellOrder(id);
    },
  },
  editBuy: {
    risky: true,
    request: { id: '<buy order id>', rate: 'rate * 0.97' },
    run: async () => {
      const open = await client.readOnly.getMyOpenMarketOrders({ cointype: coin });
      const order = open.buyorders?.[0];
      if (!order?.id || order.rate === undefined) throw new Error('No open buy orders to edit');
      const newrate = Number(order.rate) * 0.97; // drop 3% to keep it resting
      return client.fullAccess.editMarketBuyOrder({
        cointype: coin,
        id: order.id,
        rate: Number(order.rate),
        newrate,
      });
    },
  },
  editSell: {
    risky: true,
    request: { id: '<sell order id>', rate: 'rate * 1.03' },
    run: async () => {
      const open = await client.readOnly.getMyOpenMarketOrders({ cointype: coin });
      const order = open.sellorders?.[0];
      if (!order?.id || order.rate === undefined) throw new Error('No open sell orders to edit');
      const newrate = Number(order.rate) * 1.03; // bump 3% to keep it resting
      return client.fullAccess.editMarketSellOrder({
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
    run: () => client.fullAccess.cancelAllBuyOrders({ coin }),
  },
  cancelSellAll: {
    risky: true,
    request: { cointype: coin },
    run: () => client.fullAccess.cancelAllSellOrders({ coin }),
  },
};

function shape(value: unknown, depth = 0): string {
  const indent = '  '.repeat(depth);
  if (depth > 2) return `${indent}…`;
  if (Array.isArray(value)) {
    if (value.length === 0) return `${indent}array(empty)`;
    return `${indent}array(len=${value.length})\n${shape(value[0], depth + 1)}`;
  }
  if (value && typeof value === 'object') {
    const lines = Object.entries(value).map(([k, v]) => `${indent}${k}: ${typeof v}`);
    return [`${indent}object`, ...lines].join('\n');
  }
  return `${indent}${typeof value}`;
}

async function main() {
  const rawArgs = process.argv.slice(2);
  const interactive = rawArgs.includes('--interactive') || rawArgs.includes('-i');
  const selection = rawArgs.filter((a) => a !== '--interactive' && a !== '-i');
  const defaultSet = [
    'latest',
    'roStatus',
    'balances',
    'balanceCoin',
    'marketOpen',
    'status',
    'depositAddr',
    'buyQuote',
    'sellQuote',
  ];
  let chosen = selection.length ? selection : defaultSet;

  if (interactive) {
    const rl = readline.createInterface({ input, output });
    const list = Object.keys(targets).join(', ');
    const answer = await rl.question(
      `Targets (comma, 'default', or 'all') [default=${defaultSet.join(',')}]:\n${list}\n> `
    );
    const raw = answer.trim();
    if (raw === 'all') chosen = Object.keys(targets);
    else if (raw && raw !== 'default') chosen = raw.split(/[,\\s]+/).filter(Boolean);

    if (!allowRisky) {
      const riskyAns = await rl.question('Allow risky endpoints (buy/sell execution)? (y/N): ');
      allowRisky = riskyAns.trim().toLowerCase().startsWith('y');
    }
    await rl.close();
  }

  await fs.mkdir(outDir, { recursive: true });

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
      console.log('shape:\n' + shape(result));
      console.log('sample:', JSON.stringify(result, null, 2).slice(0, 2000));

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
      const file = path.join(outDir, `${Date.now()}_${name}.json`);
      await fs.writeFile(file, JSON.stringify(record, null, 2), 'utf8');
      console.log(`saved -> ${file}`);
    } catch (err) {
      console.error(`Error on ${name}:`, (err as Error).message);
    }
  }
}

main();
