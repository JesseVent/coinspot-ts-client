import { AccountBalancesResponse, AccountResponse, AffiliatePaymentsResponse, AggTradesResponse, AllMarketOrdersResponse, AllOrdersResponse, AssetBalanceResponse, AvgPriceResponse, CancelOrderResponse, CapitalDepositAddressResponse, DepthResponse, FiatDepositHistoryResponse, FiatWithdrawalHistoryResponse, MarketDepthResponse, MarketTradesWithFeesResponse, NewOrderResponse, OpenLimitOrdersResponse, OpenMarketOrdersResponse, OrderExecutionResponse, OrderQuoteResponse, OrderUpdateBuyResponse, OrderUpdateSellResponse, ReferralPaymentsResponse, Ticker24hrResponse, Ticker24hrSymbolResponse, TradesResponse, TransferHistoryResponse, WithdrawDetailsResponse, WithdrawResponse, schemas } from "./schemas";
export interface CoinspotCredential {
    key: string;
    secret: string;
}
export interface RateLimitOptions {
    maxRequests: number;
    perSeconds: number;
}
export interface RetryOptions {
    maxRetries: number;
    minDelayMs: number;
    maxDelayMs: number;
    backoffFactor: number;
}
export interface BaseUrls {
    public?: string;
    private?: string;
    readOnly?: string;
}
export interface CoinspotClientOptions {
    fullAccess?: CoinspotCredential;
    readOnly?: CoinspotCredential;
    baseUrls?: BaseUrls;
    rateLimit?: RateLimitOptions;
    retries?: RetryOptions;
    nonceFactory?: () => number;
    timeoutMs?: number;
    userAgent?: string;
}
export interface NewBuyOrderParams {
    cointype: string;
    amount: number;
    rate: number;
    markettype?: string;
}
export interface UpdateBuyOrderParams {
    cointype: string;
    id: string;
    rate: number;
    newrate: number;
    markettype?: string;
}
export interface MarketBuyNowParams {
    cointype: string;
    amounttype: "coin" | "aud";
    amount: number;
    rate?: number;
    threshold?: number;
    direction?: "UP" | "DOWN" | "BOTH";
}
export interface NewSellOrderParams {
    cointype: string;
    amount: number;
    rate: number;
    markettype?: string;
}
export interface UpdateSellOrderParams {
    cointype: string;
    id: string;
    rate: number;
    newrate: number;
    markettype?: string;
}
export interface MarketSellNowParams {
    cointype: string;
    amounttype: "coin" | "aud";
    amount: number;
    rate?: number;
    threshold?: number;
    direction?: "UP" | "DOWN" | "BOTH";
}
export interface MarketSwapNowParams {
    cointypesell: string;
    cointypebuy: string;
    amount: number;
    rate?: number;
    threshold?: number;
    direction?: "UP" | "DOWN" | "BOTH";
}
export interface CancelOpenOrdersParams {
    coin?: string;
}
export interface WithdrawDetailsParams {
    cointype: string;
}
export interface WithdrawRequestParams {
    cointype: string;
    amount: number;
    address: string;
    emailconfirm?: "YES" | "NO";
    network?: string;
    paymentid?: string;
}
export interface DepthParams {
    cointype: string;
    markettype?: string;
}
export interface MarketTradesParams {
    cointype: string;
    markettype?: string;
    startdate?: string | number;
    enddate?: string | number;
    limit?: number;
}
export interface AssetBalanceParams {
    cointype: string;
    available?: boolean;
}
export interface OpenOrdersParams {
    cointype?: string;
    markettype?: string;
}
export interface OpenLimitOrdersParams {
    cointype?: string;
}
export interface AllOrdersParams {
    cointype?: string;
    markettype?: string;
    startdate?: string | number;
    enddate?: string | number;
    limit?: number;
}
export interface TransferHistoryParams {
    startdate?: string;
    enddate?: string;
}
export interface FiatHistoryParams {
    startdate?: string;
    enddate?: string;
}
declare class RateLimiter {
    private readonly options;
    private readonly windowMs;
    private readonly timestamps;
    private queue;
    constructor(options: RateLimitOptions);
    schedule<T>(fn: () => Promise<T>): Promise<T>;
    private waitForSlot;
}
declare class CoinspotHttpError extends Error {
    readonly statusCode: number;
    readonly responseText: string;
    constructor(message: string, statusCode: number, responseText: string);
}
declare class CoinspotSchemaError extends Error {
    readonly issues: unknown;
    readonly payload: unknown;
    constructor(message: string, issues: unknown, payload: unknown);
}
interface TransportConfig {
    rateLimiter: RateLimiter;
    retries: RetryOptions;
    timeoutMs: number;
    userAgent: string;
}
declare class CoinspotTransport {
    private readonly config;
    constructor(config: TransportConfig);
    get<T>(url: string, schema: (typeof schemas)[keyof typeof schemas]): Promise<T>;
    post<T>(url: string, body: object, headers: Record<string, string>, schema: (typeof schemas)[keyof typeof schemas]): Promise<T>;
    private schedule;
    private retryableRequest;
    private execute;
}
export declare class CoinspotClient {
    private readonly options;
    readonly public: CoinspotPublicApi;
    readonly fullAccess: CoinspotFullAccessApi;
    readonly readOnly: CoinspotReadOnlyApi;
    private readonly transport;
    private readonly nonceFactory;
    private readonly baseUrls;
    constructor(options?: CoinspotClientOptions);
}
export declare class CoinspotPublicApi {
    private readonly transport;
    private readonly baseUrl;
    constructor(transport: CoinspotTransport, baseUrl: string);
    /** Binance-style ticker24hr for all markets (GET /pubapi/v2/latest). */
    ticker24hr(): Promise<Ticker24hrResponse>;
    /** Binance-style ticker24hr scoped to a symbol (GET /pubapi/v2/latest/{cointype}). */
    ticker24hrForSymbol(symbol: string): Promise<Ticker24hrSymbolResponse>;
    /** Binance-style ticker24hr for a symbol/quote pair (GET /pubapi/v2/latest/{cointype}/{markettype}). */
    ticker24hrForMarket(symbol: string, quote: string): Promise<Ticker24hrSymbolResponse>;
    /** Binance avgPrice equivalent using buy price (GET /pubapi/v2/buyprice/{cointype}). */
    avgPrice(symbol: string): Promise<AvgPriceResponse>;
    /** Binance avgPrice equivalent for a quote market (GET /pubapi/v2/buyprice/{cointype}/{markettype}). */
    avgPriceForMarket(symbol: string, quote: string): Promise<AvgPriceResponse>;
    /** Binance bookTicker bid side using CoinSpot sell price (GET /pubapi/v2/sellprice/{cointype}). */
    bookTickerBid(symbol: string): Promise<AvgPriceResponse>;
    /** Binance bookTicker bid side with quote market (GET /pubapi/v2/sellprice/{cointype}/{markettype}). */
    bookTickerBidForMarket(symbol: string, quote: string): Promise<AvgPriceResponse>;
    /** Binance depth equivalent for AUD market (GET /pubapi/v2/orders/open/{cointype}). */
    depth(symbol: string): Promise<DepthResponse>;
    /** Binance depth equivalent for a symbol/quote market (GET /pubapi/v2/orders/open/{cointype}/{markettype}). */
    depthForMarket(symbol: string, quote: string): Promise<DepthResponse>;
    /** Binance trades equivalent (GET /pubapi/v2/orders/completed/{cointype}). */
    trades(symbol: string): Promise<TradesResponse>;
    /** Binance trades equivalent for a market pair (GET /pubapi/v2/orders/completed/{cointype}/{markettype}). */
    tradesForMarket(symbol: string, quote: string): Promise<TradesResponse>;
    /** Binance aggTrades style summary (GET /pubapi/v2/orders/summary/completed/{cointype}). */
    aggTrades(symbol: string): Promise<AggTradesResponse>;
    /** Binance aggTrades style summary for a market pair (GET /pubapi/v2/orders/summary/completed/{cointype}/{markettype}). */
    aggTradesForMarket(symbol: string, quote: string): Promise<AggTradesResponse>;
}
export declare class CoinspotFullAccessApi {
    private readonly transport;
    private readonly baseUrl;
    private readonly nonceFactory;
    private readonly auth?;
    constructor(transport: CoinspotTransport, baseUrl: string, nonceFactory: () => number, auth?: CoinspotCredential | undefined);
    private ensureAuth;
    private sign;
    private post;
    /** Binance account equivalent (POST /api/v2/status). */
    account(): Promise<AccountResponse>;
    /** Binance capitalDepositAddress equivalent (POST /api/v2/my/coin/deposit). */
    capitalDepositAddress(cointype: string): Promise<CapitalDepositAddressResponse>;
    /** Binance orderQuote buy variant (POST /api/v2/quote/buy/now). */
    orderQuoteBuy(cointype: string, amount: number, amounttype: "coin" | "aud"): Promise<OrderQuoteResponse>;
    /** Binance orderQuote sell variant (POST /api/v2/quote/sell/now). */
    orderQuoteSell(cointype: string, amount: number, amounttype: "coin" | "aud"): Promise<OrderQuoteResponse>;
    /** Binance orderQuote swap variant (POST /api/v2/quote/swap/now). */
    orderQuoteSwap(cointypesell: string, cointypebuy: string, amount: number): Promise<OrderQuoteResponse>;
    /** Binance order create for BUY side (POST /api/v2/my/buy). */
    createOrderBuy(params: NewBuyOrderParams): Promise<NewOrderResponse>;
    /** Binance order update for BUY side (POST /api/v2/my/buy/edit). */
    updateOrderBuy(params: UpdateBuyOrderParams): Promise<OrderUpdateBuyResponse>;
    /** Binance order submit for market BUY (POST /api/v2/my/buy/now). */
    orderMarketBuyNow(params: MarketBuyNowParams): Promise<OrderExecutionResponse>;
    /** Binance order create for SELL side (POST /api/v2/my/sell). */
    createOrderSell(params: NewSellOrderParams): Promise<NewOrderResponse>;
    /** Binance order update for SELL side (POST /api/v2/my/sell/edit). */
    updateOrderSell(params: UpdateSellOrderParams): Promise<OrderUpdateSellResponse>;
    /** Binance order submit for market SELL (POST /api/v2/my/sell/now). */
    orderMarketSellNow(params: MarketSellNowParams): Promise<OrderExecutionResponse>;
    /** Binance order submit for swap (POST /api/v2/my/swap/now). */
    orderSwapNow(params: MarketSwapNowParams): Promise<OrderExecutionResponse>;
    /** Binance cancelOrder for BUY (POST /api/v2/my/buy/cancel). */
    cancelOrderBuy(id: string): Promise<CancelOrderResponse>;
    /** Binance cancelOpenOrders for BUY (POST /api/v2/my/buy/cancel/all). */
    cancelOpenOrdersBuy(params?: CancelOpenOrdersParams): Promise<CancelOrderResponse>;
    /** Binance cancelOrder for SELL (POST /api/v2/my/sell/cancel). */
    cancelOrderSell(id: string): Promise<CancelOrderResponse>;
    /** Binance cancelOpenOrders for SELL (POST /api/v2/my/sell/cancel/all). */
    cancelOpenOrdersSell(params?: CancelOpenOrdersParams): Promise<CancelOrderResponse>;
    /** Binance withdraw details equivalent (POST /api/v2/my/coin/withdraw/senddetails). */
    withdrawDetails(params: WithdrawDetailsParams): Promise<WithdrawDetailsResponse>;
    /** Binance withdraw submit (POST /api/v2/my/coin/withdraw/send). */
    withdraw(params: WithdrawRequestParams): Promise<WithdrawResponse>;
}
export declare class CoinspotReadOnlyApi {
    private readonly transport;
    private readonly baseUrl;
    private readonly nonceFactory;
    private readonly auth?;
    constructor(transport: CoinspotTransport, baseUrl: string, nonceFactory: () => number, auth?: CoinspotCredential | undefined);
    private ensureAuth;
    private sign;
    private post;
    /** Binance account (readonly snapshot) (POST /api/v2/ro/status). */
    account(): Promise<AccountResponse>;
    /** Binance depth for market data (POST /api/v2/ro/orders/market/open). */
    marketDepth(params: DepthParams): Promise<MarketDepthResponse>;
    /** Binance trades with fees analogue (POST /api/v2/ro/orders/market/completed). */
    marketTrades(params: MarketTradesParams): Promise<MarketTradesWithFeesResponse>;
    /** Binance account balances snapshot (POST /api/v2/ro/my/balances). */
    accountBalances(): Promise<AccountBalancesResponse>;
    /** Binance asset balance (POST /api/v2/ro/my/balance/{cointype}?available=yes/no). */
    assetBalance(params: AssetBalanceParams): Promise<AssetBalanceResponse>;
    /** Binance openOrders (market) (POST /api/v2/ro/my/orders/market/open). */
    openMarketOrders(params: OpenOrdersParams): Promise<OpenMarketOrdersResponse>;
    /** Binance openOrders (limit) (POST /api/v2/ro/my/orders/limit/open). */
    openLimitOrders(params: OpenLimitOrdersParams): Promise<OpenLimitOrdersResponse>;
    /** Binance allOrders (POST /api/v2/ro/my/orders/completed). */
    allOrders(params: AllOrdersParams): Promise<AllOrdersResponse>;
    /** Binance allOrders for market side (POST /api/v2/ro/my/orders/market/completed). */
    allMarketOrders(params: AllOrdersParams): Promise<AllMarketOrdersResponse>;
    /** Binance capital transfer history analogue (POST /api/v2/ro/my/sendreceive). */
    transferHistory(params: TransferHistoryParams): Promise<TransferHistoryResponse>;
    /** Fiat deposit history (POST /api/v2/ro/my/deposits). */
    fiatDepositHistory(params: FiatHistoryParams): Promise<FiatDepositHistoryResponse>;
    /** Fiat withdrawal history (POST /api/v2/ro/my/withdrawals). */
    fiatWithdrawalHistory(params: FiatHistoryParams): Promise<FiatWithdrawalHistoryResponse>;
    /** Affiliate payments received (POST /api/v2/ro/my/affiliatepayments). */
    affiliatePayments(): Promise<AffiliatePaymentsResponse>;
    /** Referral payments received (POST /api/v2/ro/my/referralpayments). */
    referralPayments(): Promise<ReferralPaymentsResponse>;
}
export { CoinspotHttpError, CoinspotSchemaError };
