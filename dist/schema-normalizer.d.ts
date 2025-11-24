import { AccountBalancesResponse, DepthResponse, TradesResponse } from "./schemas";
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
    a: number;
    p: string;
    q: string;
    f: number;
    l: number;
    T: number;
    m: boolean;
    M: boolean;
}
export interface BinanceBalance {
    asset: string;
    free: string;
    locked: string;
}
/** Map CoinSpot depth to Binance depth (stringified bids/asks). */
export declare const toBinanceDepth: (res: DepthResponse, lastUpdateId?: number) => BinanceDepth;
/** Map CoinSpot trades to Binance recent trades shape (best-effort for missing flags/ids). */
export declare const toBinanceTrades: (res: TradesResponse) => BinanceTrade[];
/** Map CoinSpot trades to Binance aggTrades (compressed) shape. */
export declare const toBinanceAggTrades: (res: TradesResponse) => BinanceAggTrade[];
/** Map CoinSpot balances to Binance account balances (free/locked). */
export declare const toBinanceBalances: (res: AccountBalancesResponse) => BinanceBalance[];
