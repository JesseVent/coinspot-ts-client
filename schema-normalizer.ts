// Helpers to map CoinSpot responses into Binance-like shapes for generic adapters.
// Binancing is lossy: CoinSpot lacks maker flags, update IDs, and exact trade IDs in some contexts.

import {
    AccountBalancesResponse,
    DepthResponse,
    TradesResponse,
} from './schemas';

const toStringNumber = (n: number | null | undefined) =>
    n === null || n === undefined ? undefined : n.toString();

const safeNumber = (n: number | null | undefined) => (typeof n === 'number' ? n : undefined);

const nowMs = () => Date.now();

export interface BinanceDepth {
    lastUpdateId: number;
    bids: [string, string][];
    asks: [string, string][];
}

export interface BinanceTrade {
    id: number;
    price: string;
    qty: string;
    quoteQty: string;
    time: number;
    isBuyerMaker: boolean;
    isBestMatch: boolean;
}

export interface BinanceAggTrade {
    a: number; // Aggregate tradeId
    p: string; // Price
    q: string; // Quantity
    f: number; // First tradeId
    l: number; // Last tradeId
    T: number; // Timestamp
    m: boolean; // Was buyer the maker?
    M: boolean; // Was this the best match?
}

export interface BinanceBalance {
    asset: string;
    free: string;
    locked: string;
}

/** Map CoinSpot depth to Binance depth (stringified bids/asks). */
export const toBinanceDepth = (res: DepthResponse, lastUpdateId = nowMs()): BinanceDepth => {
    const mapSide = (orders: DepthResponse['buyorders']) =>
        orders
            .map((o) => {
                const price = toStringNumber(o.rate);
                const qty = toStringNumber(o.amount);
                if (!price || !qty) return undefined;
                return [price, qty] as [string, string];
            })
            .filter(Boolean) as [string, string][];

    return {
        lastUpdateId,
        bids: mapSide(res.buyorders),
        asks: mapSide(res.sellorders),
    };
};

/** Map CoinSpot trades to Binance recent trades shape (best-effort for missing flags/ids). */
export const toBinanceTrades = (res: TradesResponse): BinanceTrade[] => {
    const mapSet = (
        orders: TradesResponse['buyorders'],
        isBuyerMaker: boolean,
        offset: number
    ): BinanceTrade[] =>
        orders.map((o, idx) => {
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

/** Map CoinSpot trades to Binance aggTrades (compressed) shape. */
export const toBinanceAggTrades = (res: TradesResponse): BinanceAggTrade[] => {
    const normalize = (
        orders: TradesResponse['buyorders'],
        isBuyerMaker: boolean,
        offset: number
    ): BinanceAggTrade[] =>
        orders.map((o, idx) => {
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

/** Map CoinSpot balances to Binance account balances (free/locked). */
export const toBinanceBalances = (res: AccountBalancesResponse): BinanceBalance[] => {
    const balances = res.balances ?? [];
    return balances.flatMap((record) =>
        Object.entries(record).map(([asset, entry]) => {
            const free = safeNumber(entry.available) ?? safeNumber(entry.balance) ?? 0;
            const total = safeNumber(entry.balance) ?? free;
            const locked = Math.max(total - free, 0);
            return {
                asset,
                free: free.toString(),
                locked: locked.toString(),
            };
        })
    );
};
