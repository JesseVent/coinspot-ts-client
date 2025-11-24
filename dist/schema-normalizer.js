"use strict";
// Helpers to map CoinSpot responses into Binance-like shapes for generic adapters.
// Binancing is lossy: CoinSpot lacks maker flags, update IDs, and exact trade IDs in some contexts.
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBinanceBalances = exports.toBinanceAggTrades = exports.toBinanceTrades = exports.toBinanceDepth = void 0;
const toStringNumber = (n) => n === null || n === undefined ? undefined : n.toString();
const safeNumber = (n) => typeof n === "number" ? n : undefined;
const nowMs = () => Date.now();
/** Map CoinSpot depth to Binance depth (stringified bids/asks). */
const toBinanceDepth = (res, lastUpdateId = nowMs()) => {
    const mapSide = (orders) => orders
        .map((o) => {
        const price = toStringNumber(o.rate);
        const qty = toStringNumber(o.amount);
        if (!price || !qty)
            return undefined;
        return [price, qty];
    })
        .filter(Boolean);
    return {
        lastUpdateId,
        bids: mapSide(res.buyorders),
        asks: mapSide(res.sellorders),
    };
};
exports.toBinanceDepth = toBinanceDepth;
/** Map CoinSpot trades to Binance recent trades shape (best-effort for missing flags/ids). */
const toBinanceTrades = (res) => {
    const mapSet = (orders, isBuyerMaker, offset) => orders.map((o, idx) => {
        const priceNum = safeNumber(o.rate) ?? 0;
        const qtyNum = safeNumber(o.amount) ?? 0;
        return {
            id: offset + idx,
            price: priceNum.toString(),
            qty: qtyNum.toString(),
            quoteQty: (priceNum * qtyNum).toString(),
            time: o.solddate ? Date.parse(o.solddate) : nowMs(),
            isBuyerMaker,
            isBestMatch: true,
        };
    });
    const buys = mapSet(res.buyorders, false, 0);
    const sells = mapSet(res.sellorders, true, buys.length);
    return [...buys, ...sells];
};
exports.toBinanceTrades = toBinanceTrades;
/** Map CoinSpot trades to Binance aggTrades (compressed) shape. */
const toBinanceAggTrades = (res) => {
    const normalize = (orders, isBuyerMaker, offset) => orders.map((o, idx) => {
        const priceNum = safeNumber(o.rate) ?? 0;
        const qtyNum = safeNumber(o.amount) ?? 0;
        const id = offset + idx;
        return {
            a: id,
            p: priceNum.toString(),
            q: qtyNum.toString(),
            f: id,
            l: id,
            T: o.solddate ? Date.parse(o.solddate) : nowMs(),
            m: isBuyerMaker,
            M: true,
        };
    });
    const buys = normalize(res.buyorders, false, 0);
    const sells = normalize(res.sellorders, true, buys.length);
    return [...buys, ...sells];
};
exports.toBinanceAggTrades = toBinanceAggTrades;
/** Map CoinSpot balances to Binance account balances (free/locked). */
const toBinanceBalances = (res) => {
    const balances = res.balances ?? [];
    return balances.flatMap((record) => Object.entries(record).map(([asset, entry]) => {
        const free = safeNumber(entry.available) ?? safeNumber(entry.balance) ?? 0;
        const total = safeNumber(entry.balance) ?? free;
        const locked = Math.max(total - free, 0);
        return {
            asset,
            free: free.toString(),
            locked: locked.toString(),
        };
    }));
};
exports.toBinanceBalances = toBinanceBalances;
