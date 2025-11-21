import { CancellationResponse, CompletedOrdersResponse, CompletedOrdersSummaryResponse, DepositAddressesResponse, EditOrderResponse, ExecutionResponse, LatestCoinPricesResponse, LatestPricesResponse, LatestRateResponse, OrderBookResponse, PlacedOrderResponse, QuoteResponse, ReadOnlyAffiliatePaymentsResponse, ReadOnlyBalanceResponse, ReadOnlyBalancesResponse, ReadOnlyDepositsResponse, ReadOnlyMarketOrdersResponse, ReadOnlyMarketOrdersWithFeesResponse, ReadOnlyMyMarketOrdersHistoryResponse, ReadOnlyMyOpenLimitOrdersResponse, ReadOnlyMyOpenMarketOrdersResponse, ReadOnlyMyOrdersHistoryResponse, ReadOnlyReferralPaymentsResponse, ReadOnlySendReceiveResponse, ReadOnlyWithdrawalsResponse, SendCoinResponse, StatusResponse, WithdrawalDetailsResponse, schemas } from './schemas';
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
export interface PlaceMarketBuyOrderParams {
    cointype: string;
    amount: number;
    rate: number;
    markettype?: string;
}
export interface EditMarketBuyOrderParams {
    cointype: string;
    id: string;
    rate: number;
    newrate: number;
}
export interface BuyNowOrderParams {
    cointype: string;
    amounttype: 'coin' | 'aud';
    amount: number;
    rate?: number;
    threshold?: number;
    direction?: 'UP' | 'DOWN' | 'BOTH';
}
export interface PlaceMarketSellOrderParams {
    cointype: string;
    amount: number;
    rate: number;
    markettype?: string;
}
export interface EditMarketSellOrderParams {
    cointype: string;
    id: string;
    rate: number;
    newrate: number;
}
export interface SellNowOrderParams {
    cointype: string;
    amounttype: 'coin' | 'aud';
    amount: number;
    rate?: number;
    threshold?: number;
    direction?: 'UP' | 'DOWN' | 'BOTH';
}
export interface SwapNowOrderParams {
    cointypesell: string;
    cointypebuy: string;
    amount: number;
    rate?: number;
    threshold?: number;
    direction?: 'UP' | 'DOWN' | 'BOTH';
}
export interface CancelOrdersParams {
    coin?: string;
}
export interface WithdrawalDetailsParams {
    cointype: string;
}
export interface SendCoinsParams {
    cointype: string;
    amount: number;
    address: string;
    emailconfirm?: 'YES' | 'NO';
    network?: string;
    paymentid?: string;
}
export interface MarketOpenOrdersParams {
    cointype: string;
    markettype?: string;
}
export interface MarketCompletedOrdersParams {
    cointype: string;
    markettype?: string;
    startdate?: string | number;
    enddate?: string | number;
    limit?: number;
}
export interface BalanceForCoinParams {
    cointype: string;
    available?: boolean;
}
export interface MyOpenMarketOrdersParams {
    cointype?: string;
    markettype?: string;
}
export interface MyOpenLimitOrdersParams {
    cointype?: string;
}
export interface MyOrdersHistoryParams {
    cointype?: string;
    markettype?: string;
    startdate?: string | number;
    enddate?: string | number;
    limit?: number;
}
export interface SendReceiveHistoryParams {
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
    /** Latest buy/sell/last prices for every market (GET /pubapi/v2/latest). */
    getLatestPrices(): Promise<LatestPricesResponse>;
    /** Latest prices for a specific coin (GET /pubapi/v2/latest/{cointype}). */
    getLatestPricesForCoin(cointype: string): Promise<LatestCoinPricesResponse>;
    /** Latest prices for a specific coin/market pair (GET /pubapi/v2/latest/{cointype}/{markettype}). */
    getLatestPricesForCoinMarket(cointype: string, markettype: string): Promise<LatestCoinPricesResponse>;
    /** Latest buy price for a coin in AUD (GET /pubapi/v2/buyprice/{cointype}). */
    getLatestBuyPrice(cointype: string): Promise<LatestRateResponse>;
    /** Latest buy price for a coin in a non-AUD market (GET /pubapi/v2/buyprice/{cointype}/{markettype}). */
    getLatestBuyPriceInMarket(cointype: string, markettype: string): Promise<LatestRateResponse>;
    /** Latest sell price for a coin in AUD (GET /pubapi/v2/sellprice/{cointype}). */
    getLatestSellPrice(cointype: string): Promise<LatestRateResponse>;
    /** Latest sell price for a coin in a non-AUD market (GET /pubapi/v2/sellprice/{cointype}/{markettype}). */
    getLatestSellPriceInMarket(cointype: string, markettype: string): Promise<LatestRateResponse>;
    /** Top buy/sell orders for a coin in AUD (GET /pubapi/v2/orders/open/{cointype}). */
    getOpenOrders(cointype: string): Promise<OrderBookResponse>;
    /** Top buy/sell orders for a coin/market pair (GET /pubapi/v2/orders/open/{cointype}/{markettype}). */
    getOpenOrdersForMarket(cointype: string, markettype: string): Promise<OrderBookResponse>;
    /** Completed buy/sell orders for a coin in AUD (GET /pubapi/v2/orders/completed/{cointype}). */
    getCompletedOrders(cointype: string): Promise<CompletedOrdersResponse>;
    /** Completed buy/sell orders for a coin/market pair (GET /pubapi/v2/orders/completed/{cointype}/{markettype}). */
    getCompletedOrdersForMarket(cointype: string, markettype: string): Promise<CompletedOrdersResponse>;
    /** Completed orders summary for a coin in AUD (GET /pubapi/v2/orders/summary/completed/{cointype}). */
    getCompletedOrdersSummary(cointype: string): Promise<CompletedOrdersSummaryResponse>;
    /** Completed orders summary for a coin/market pair (GET /pubapi/v2/orders/summary/completed/{cointype}/{markettype}). */
    getCompletedOrdersSummaryForMarket(cointype: string, markettype: string): Promise<CompletedOrdersSummaryResponse>;
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
    /** Status heartbeat for full-access key (POST /api/v2/status). */
    getStatus(): Promise<StatusResponse>;
    /** Retrieve deposit addresses for a coin (POST /api/v2/my/coin/deposit). */
    getDepositAddresses(cointype: string): Promise<DepositAddressesResponse>;
    /** Quote a buy-now order (POST /api/v2/quote/buy/now). */
    getBuyNowQuote(cointype: string, amount: number, amounttype: 'coin' | 'aud'): Promise<QuoteResponse>;
    /** Quote a sell-now order (POST /api/v2/quote/sell/now). */
    getSellNowQuote(cointype: string, amount: number, amounttype: 'coin' | 'aud'): Promise<QuoteResponse>;
    /** Quote a swap-now order (POST /api/v2/quote/swap/now). */
    getSwapNowQuote(cointypesell: string, cointypebuy: string, amount: number): Promise<QuoteResponse>;
    /** Place a market buy order (POST /api/v2/my/buy). */
    placeMarketBuyOrder(params: PlaceMarketBuyOrderParams): Promise<PlacedOrderResponse>;
    /** Edit an open market buy order (POST /api/v2/my/buy/edit). */
    editMarketBuyOrder(params: EditMarketBuyOrderParams): Promise<EditOrderResponse>;
    /** Execute a buy-now order at the current market rate (POST /api/v2/my/buy/now). */
    placeBuyNowOrder(params: BuyNowOrderParams): Promise<ExecutionResponse>;
    /** Place a market sell order (POST /api/v2/my/sell). */
    placeMarketSellOrder(params: PlaceMarketSellOrderParams): Promise<PlacedOrderResponse>;
    /** Edit an open market sell order (POST /api/v2/my/sell/edit). */
    editMarketSellOrder(params: EditMarketSellOrderParams): Promise<EditOrderResponse>;
    /** Execute a sell-now order at the current market rate (POST /api/v2/my/sell/now). */
    placeSellNowOrder(params: SellNowOrderParams): Promise<ExecutionResponse>;
    /** Execute a swap-now order between two coins (POST /api/v2/my/swap/now). */
    placeSwapNowOrder(params: SwapNowOrderParams): Promise<ExecutionResponse>;
    /** Cancel a single buy order (POST /api/v2/my/buy/cancel). */
    cancelBuyOrder(id: string): Promise<CancellationResponse>;
    /** Cancel all open buy orders, optionally filtered by coin (POST /api/v2/my/buy/cancel/all). */
    cancelAllBuyOrders(params?: CancelOrdersParams): Promise<CancellationResponse>;
    /** Cancel a single sell order (POST /api/v2/my/sell/cancel). */
    cancelSellOrder(id: string): Promise<CancellationResponse>;
    /** Cancel all open sell orders, optionally filtered by coin (POST /api/v2/my/sell/cancel/all). */
    cancelAllSellOrders(params?: CancelOrdersParams): Promise<CancellationResponse>;
    /** List withdrawal details for a coin (POST /api/v2/my/coin/withdraw/senddetails). */
    getWithdrawalDetails(params: WithdrawalDetailsParams): Promise<WithdrawalDetailsResponse>;
    /** Send a coin withdrawal (POST /api/v2/my/coin/withdraw/send). */
    sendCoins(params: SendCoinsParams): Promise<SendCoinResponse>;
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
    /** Status heartbeat for read-only key (POST /api/v2/ro/status). */
    getStatus(): Promise<StatusResponse>;
    /** Order book for a specific market (POST /api/v2/ro/orders/market/open). */
    getMarketOpenOrders(params: MarketOpenOrdersParams): Promise<ReadOnlyMarketOrdersResponse>;
    /** Completed market orders with optional filters (POST /api/v2/ro/orders/market/completed). */
    getMarketCompletedOrders(params: MarketCompletedOrdersParams): Promise<ReadOnlyMarketOrdersWithFeesResponse>;
    /** All balances for the account (POST /api/v2/ro/my/balances). */
    getBalances(): Promise<ReadOnlyBalancesResponse>;
    /** Balance for a specific coin (POST /api/v2/ro/my/balance/{cointype}?available=yes/no). */
    getBalanceForCoin(params: BalanceForCoinParams): Promise<ReadOnlyBalanceResponse>;
    /** Open market orders placed by the account (POST /api/v2/ro/my/orders/market/open). */
    getMyOpenMarketOrders(params: MyOpenMarketOrdersParams): Promise<ReadOnlyMyOpenMarketOrdersResponse>;
    /** Open limit orders placed by the account (POST /api/v2/ro/my/orders/limit/open). */
    getMyOpenLimitOrders(params: MyOpenLimitOrdersParams): Promise<ReadOnlyMyOpenLimitOrdersResponse>;
    /** Completed order history (POST /api/v2/ro/my/orders/completed). */
    getMyOrdersHistory(params: MyOrdersHistoryParams): Promise<ReadOnlyMyOrdersHistoryResponse>;
    /** Completed market order history (POST /api/v2/ro/my/orders/market/completed). */
    getMyMarketOrdersHistory(params: MyOrdersHistoryParams): Promise<ReadOnlyMyMarketOrdersHistoryResponse>;
    /** Send and receive history (POST /api/v2/ro/my/sendreceive). */
    getSendReceiveHistory(params: SendReceiveHistoryParams): Promise<ReadOnlySendReceiveResponse>;
    /** AUD deposit history (POST /api/v2/ro/my/deposits). */
    getDepositHistory(params: FiatHistoryParams): Promise<ReadOnlyDepositsResponse>;
    /** AUD withdrawal history (POST /api/v2/ro/my/withdrawals). */
    getWithdrawalHistory(params: FiatHistoryParams): Promise<ReadOnlyWithdrawalsResponse>;
    /** Affiliate payments received (POST /api/v2/ro/my/affiliatepayments). */
    getAffiliatePayments(): Promise<ReadOnlyAffiliatePaymentsResponse>;
    /** Referral payments received (POST /api/v2/ro/my/referralpayments). */
    getReferralPayments(): Promise<ReadOnlyReferralPaymentsResponse>;
}
export { CoinspotHttpError, CoinspotSchemaError };
