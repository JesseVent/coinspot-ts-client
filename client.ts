import crypto from 'node:crypto';
import https from 'node:https';
import { URL } from 'node:url';
import {
    CancellationResponse,
    CompletedOrdersResponse,
    CompletedOrdersSummaryResponse,
    DepositAddressesResponse,
    EditOrderResponse,
    ExecutionResponse,
    LatestCoinPricesResponse,
    LatestPricesResponse,
    LatestRateResponse,
    OrderBookResponse,
    PlacedOrderResponse,
    QuoteResponse,
    ReadOnlyAffiliatePaymentsResponse,
    ReadOnlyBalanceResponse,
    ReadOnlyBalancesResponse,
    ReadOnlyDepositsResponse,
    ReadOnlyMarketOrdersResponse,
    ReadOnlyMarketOrdersWithFeesResponse,
    ReadOnlyMyMarketOrdersHistoryResponse,
    ReadOnlyMyOpenLimitOrdersResponse,
    ReadOnlyMyOpenMarketOrdersResponse,
    ReadOnlyMyOrdersHistoryResponse,
    ReadOnlyReferralPaymentsResponse,
    ReadOnlySendReceiveResponse,
    ReadOnlyWithdrawalsResponse,
    SendCoinResponse,
    StatusResponse,
    WithdrawalDetailsResponse,
    schemas,
} from './schemas';

type HttpMethod = 'GET' | 'POST';

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

const DEFAULT_BASE_URLS: Required<BaseUrls> = {
    public: 'https://www.coinspot.com.au/pubapi/v2',
    private: 'https://www.coinspot.com.au/api/v2',
    readOnly: 'https://www.coinspot.com.au/api/v2/ro',
};

const DEFAULT_RATE_LIMIT: RateLimitOptions = {
    maxRequests: 995,
    perSeconds: 60,
};

const DEFAULT_RETRIES: RetryOptions = {
    maxRetries: 3,
    minDelayMs: 200,
    maxDelayMs: 2_000,
    backoffFactor: 2,
};

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

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class RateLimiter {
    private readonly windowMs: number;
    private readonly timestamps: number[] = [];
    private queue: Promise<unknown> = Promise.resolve();

    constructor(private readonly options: RateLimitOptions) {
        this.windowMs = options.perSeconds * 1_000;
    }

    async schedule<T>(fn: () => Promise<T>): Promise<T> {
        const runner = async () => {
            await this.waitForSlot();
            return fn();
        };

        const next = this.queue.then(runner, runner);
        this.queue = next.catch(() => undefined);
        return next;
    }

    private async waitForSlot(): Promise<void> {
        while (true) {
            const now = Date.now();
            while (this.timestamps.length && now - this.timestamps[0] > this.windowMs) {
                this.timestamps.shift();
            }

            if (this.timestamps.length < this.options.maxRequests) {
                this.timestamps.push(Date.now());
                return;
            }

            const retryAfter = this.windowMs - (now - this.timestamps[0]) + 1;
            await sleep(retryAfter);
        }
    }
}

class CoinspotHttpError extends Error {
    constructor(
        message: string,
        public readonly statusCode: number,
        public readonly responseText: string
    ) {
        super(message);
        this.name = 'CoinspotHttpError';
    }
}

class CoinspotSchemaError extends Error {
    constructor(
        message: string,
        public readonly issues: unknown,
        public readonly payload: unknown
    ) {
        super(message);
        this.name = 'CoinspotSchemaError';
    }
}

interface TransportConfig {
    rateLimiter: RateLimiter;
    retries: RetryOptions;
    timeoutMs: number;
    userAgent: string;
}

class CoinspotTransport {
    constructor(private readonly config: TransportConfig) {}

    async get<T>(url: string, schema: (typeof schemas)[keyof typeof schemas]): Promise<T> {
        return this.schedule(() =>
            this.retryableRequest<T>('GET', url, undefined, {}, schema)
        );
    }

    async post<T>(
        url: string,
        body: Record<string, unknown>,
        headers: Record<string, string>,
        schema: (typeof schemas)[keyof typeof schemas]
    ): Promise<T> {
        return this.schedule(() =>
            this.retryableRequest<T>('POST', url, body, headers, schema)
        );
    }

    private schedule<T>(fn: () => Promise<T>): Promise<T> {
        return this.config.rateLimiter.schedule(fn);
    }

    private async retryableRequest<T>(
        method: HttpMethod,
        url: string,
        body: Record<string, unknown> | undefined,
        headers: Record<string, string>,
        schema: (typeof schemas)[keyof typeof schemas]
    ): Promise<T> {
        let attempt = 0;
        let delay = this.config.retries.minDelayMs;
        let lastError: unknown;

        while (attempt <= this.config.retries.maxRetries) {
            try {
                return await this.execute<T>(method, url, body, headers, schema);
            } catch (error) {
                lastError = error;
                const shouldRetry =
                    error instanceof CoinspotHttpError
                        ? error.statusCode >= 500 || error.statusCode === 429
                        : error instanceof CoinspotSchemaError
                          ? false
                          : error instanceof Error;

                if (!shouldRetry || attempt === this.config.retries.maxRetries) {
                    throw error;
                }

                await sleep(Math.min(delay, this.config.retries.maxDelayMs));
                delay *= this.config.retries.backoffFactor;
                attempt += 1;
            }
        }

        throw lastError;
    }

    private async execute<T>(
        method: HttpMethod,
        url: string,
        body: Record<string, unknown> | undefined,
        headers: Record<string, string>,
        schema: (typeof schemas)[keyof typeof schemas]
    ): Promise<T> {
        const payload = body ? JSON.stringify(body) : undefined;
        const target = new URL(url);

        const baseHeaders: Record<string, string | number> = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': this.config.userAgent,
            ...headers,
        };

        if (payload) {
            baseHeaders['Content-Length'] = Buffer.byteLength(payload);
        }

        const requestOptions: https.RequestOptions = {
            method,
            hostname: target.hostname,
            path: `${target.pathname}${target.search}`,
            protocol: target.protocol,
            port: target.port || undefined,
            headers: baseHeaders,
            timeout: this.config.timeoutMs,
        };

        const responseText = await new Promise<string>((resolve, reject) => {
            const req = https.request(requestOptions, (res) => {
                const chunks: Buffer[] = [];
                res.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
                res.on('end', () => {
                    const text = Buffer.concat(chunks).toString('utf8');
                    const statusCode = res.statusCode ?? 0;
                    if (statusCode >= 200 && statusCode < 300) {
                        resolve(text);
                        return;
                    }

                    reject(
                        new CoinspotHttpError(
                            `Coinspot request failed with status ${statusCode}`,
                            statusCode,
                            text
                        )
                    );
                });
            });

            req.on('error', reject);
            req.on('timeout', () => {
                req.destroy(new Error('Coinspot request timed out'));
            });

            if (payload) {
                req.write(payload);
            }

            req.end();
        });

        let json: unknown;
        try {
            json = responseText ? JSON.parse(responseText) : {};
        } catch (error) {
            throw new Error(`Failed to parse Coinspot response: ${(error as Error).message}`);
        }

        const parsed = schema.safeParse(json);
        if (!parsed.success) {
            throw new CoinspotSchemaError(
                'Coinspot response failed schema validation',
                parsed.error.issues,
                json
            );
        }

        return parsed.data as T;
    }
}

export class CoinspotClient {
    public readonly public: CoinspotPublicApi;
    public readonly fullAccess: CoinspotFullAccessApi;
    public readonly readOnly: CoinspotReadOnlyApi;

    private readonly transport: CoinspotTransport;
    private readonly nonceFactory: () => number;
    private readonly baseUrls: Required<BaseUrls>;

    constructor(private readonly options: CoinspotClientOptions = {}) {
        this.baseUrls = {
            ...DEFAULT_BASE_URLS,
            ...options.baseUrls,
        };

        this.nonceFactory = options.nonceFactory ?? (() => Date.now());

        const rateLimiter = new RateLimiter(options.rateLimit ?? DEFAULT_RATE_LIMIT);
        this.transport = new CoinspotTransport({
            rateLimiter,
            retries: options.retries ?? DEFAULT_RETRIES,
            timeoutMs: options.timeoutMs ?? 15_000,
            userAgent: options.userAgent ?? 'coinspot-ts-client/1.0.0',
        });

        this.public = new CoinspotPublicApi(this.transport, this.baseUrls.public);
        this.fullAccess = new CoinspotFullAccessApi(
            this.transport,
            this.baseUrls.private,
            this.nonceFactory,
            options.fullAccess
        );
        this.readOnly = new CoinspotReadOnlyApi(
            this.transport,
            this.baseUrls.readOnly,
            this.nonceFactory,
            options.readOnly ?? options.fullAccess
        );
    }
}

export class CoinspotPublicApi {
    constructor(
        private readonly transport: CoinspotTransport,
        private readonly baseUrl: string
    ) {}

    /** Latest buy/sell/last prices for every market (GET /pubapi/v2/latest). */
    getLatestPrices(): Promise<LatestPricesResponse> {
        return this.transport.get(`${this.baseUrl}/latest`, schemas.latestPrices);
    }

    /** Latest prices for a specific coin (GET /pubapi/v2/latest/{cointype}). */
    getLatestPricesForCoin(cointype: string): Promise<LatestCoinPricesResponse> {
        return this.transport.get(
            `${this.baseUrl}/latest/${encodeURIComponent(cointype)}`,
            schemas.latestCoinPrices
        );
    }

    /** Latest prices for a specific coin/market pair (GET /pubapi/v2/latest/{cointype}/{markettype}). */
    getLatestPricesForCoinMarket(
        cointype: string,
        markettype: string
    ): Promise<LatestCoinPricesResponse> {
        return this.transport.get(
            `${this.baseUrl}/latest/${encodeURIComponent(cointype)}/${encodeURIComponent(markettype)}`,
            schemas.latestCoinPrices
        );
    }

    /** Latest buy price for a coin in AUD (GET /pubapi/v2/buyprice/{cointype}). */
    getLatestBuyPrice(cointype: string): Promise<LatestRateResponse> {
        return this.transport.get(
            `${this.baseUrl}/buyprice/${encodeURIComponent(cointype)}`,
            schemas.latestRate
        );
    }

    /** Latest buy price for a coin in a non-AUD market (GET /pubapi/v2/buyprice/{cointype}/{markettype}). */
    getLatestBuyPriceInMarket(
        cointype: string,
        markettype: string
    ): Promise<LatestRateResponse> {
        return this.transport.get(
            `${this.baseUrl}/buyprice/${encodeURIComponent(cointype)}/${encodeURIComponent(markettype)}`,
            schemas.latestRate
        );
    }

    /** Latest sell price for a coin in AUD (GET /pubapi/v2/sellprice/{cointype}). */
    getLatestSellPrice(cointype: string): Promise<LatestRateResponse> {
        return this.transport.get(
            `${this.baseUrl}/sellprice/${encodeURIComponent(cointype)}`,
            schemas.latestRate
        );
    }

    /** Latest sell price for a coin in a non-AUD market (GET /pubapi/v2/sellprice/{cointype}/{markettype}). */
    getLatestSellPriceInMarket(
        cointype: string,
        markettype: string
    ): Promise<LatestRateResponse> {
        return this.transport.get(
            `${this.baseUrl}/sellprice/${encodeURIComponent(cointype)}/${encodeURIComponent(markettype)}`,
            schemas.latestRate
        );
    }

    /** Top buy/sell orders for a coin in AUD (GET /pubapi/v2/orders/open/{cointype}). */
    getOpenOrders(cointype: string): Promise<OrderBookResponse> {
        return this.transport.get(
            `${this.baseUrl}/orders/open/${encodeURIComponent(cointype)}`,
            schemas.orderBook
        );
    }

    /** Top buy/sell orders for a coin/market pair (GET /pubapi/v2/orders/open/{cointype}/{markettype}). */
    getOpenOrdersForMarket(
        cointype: string,
        markettype: string
    ): Promise<OrderBookResponse> {
        return this.transport.get(
            `${this.baseUrl}/orders/open/${encodeURIComponent(cointype)}/${encodeURIComponent(markettype)}`,
            schemas.orderBook
        );
    }

    /** Completed buy/sell orders for a coin in AUD (GET /pubapi/v2/orders/completed/{cointype}). */
    getCompletedOrders(cointype: string): Promise<CompletedOrdersResponse> {
        return this.transport.get(
            `${this.baseUrl}/orders/completed/${encodeURIComponent(cointype)}`,
            schemas.completedOrders
        );
    }

    /** Completed buy/sell orders for a coin/market pair (GET /pubapi/v2/orders/completed/{cointype}/{markettype}). */
    getCompletedOrdersForMarket(
        cointype: string,
        markettype: string
    ): Promise<CompletedOrdersResponse> {
        return this.transport.get(
            `${this.baseUrl}/orders/completed/${encodeURIComponent(cointype)}/${encodeURIComponent(markettype)}`,
            schemas.completedOrders
        );
    }

    /** Completed orders summary for a coin in AUD (GET /pubapi/v2/orders/summary/completed/{cointype}). */
    getCompletedOrdersSummary(cointype: string): Promise<CompletedOrdersSummaryResponse> {
        return this.transport.get(
            `${this.baseUrl}/orders/summary/completed/${encodeURIComponent(cointype)}`,
            schemas.completedOrdersSummary
        );
    }

    /** Completed orders summary for a coin/market pair (GET /pubapi/v2/orders/summary/completed/{cointype}/{markettype}). */
    getCompletedOrdersSummaryForMarket(
        cointype: string,
        markettype: string
    ): Promise<CompletedOrdersSummaryResponse> {
        return this.transport.get(
            `${this.baseUrl}/orders/summary/completed/${encodeURIComponent(cointype)}/${encodeURIComponent(markettype)}`,
            schemas.completedOrdersSummary
        );
    }
}

export class CoinspotFullAccessApi {
    constructor(
        private readonly transport: CoinspotTransport,
        private readonly baseUrl: string,
        private readonly nonceFactory: () => number,
        private readonly auth?: CoinspotCredential
    ) {}

    private ensureAuth(): CoinspotCredential {
        if (!this.auth) {
            throw new Error('Full access API key/secret is required for this call');
        }
        return this.auth;
    }

    private sign(body: Record<string, unknown>, credential: CoinspotCredential): string {
        return crypto
            .createHmac('sha512', credential.secret)
            .update(JSON.stringify(body))
            .digest('hex');
    }

    private async post<T>(
        path: string,
        body: Record<string, unknown>,
        schema: (typeof schemas)[keyof typeof schemas]
    ): Promise<T> {
        const credential = this.ensureAuth();
        const payload = { nonce: this.nonceFactory(), ...body };
        const headers = {
            key: credential.key,
            sign: this.sign(payload, credential),
        };

        return this.transport.post<T>(`${this.baseUrl}${path}`, payload, headers, schema);
    }

    /** Status heartbeat for full-access key (POST /api/v2/status). */
    getStatus(): Promise<StatusResponse> {
        return this.post('/status', {}, schemas.status);
    }

    /** Retrieve deposit addresses for a coin (POST /api/v2/my/coin/deposit). */
    getDepositAddresses(cointype: string): Promise<DepositAddressesResponse> {
        return this.post('/my/coin/deposit', { cointype }, schemas.depositAddresses);
    }

    /** Quote a buy-now order (POST /api/v2/quote/buy/now). */
    getBuyNowQuote(
        cointype: string,
        amount: number,
        amounttype: 'coin' | 'aud'
    ): Promise<QuoteResponse> {
        return this.post(
            '/quote/buy/now',
            { cointype, amount, amounttype },
            schemas.quote
        );
    }

    /** Quote a sell-now order (POST /api/v2/quote/sell/now). */
    getSellNowQuote(
        cointype: string,
        amount: number,
        amounttype: 'coin' | 'aud'
    ): Promise<QuoteResponse> {
        return this.post(
            '/quote/sell/now',
            { cointype, amount, amounttype },
            schemas.quote
        );
    }

    /** Quote a swap-now order (POST /api/v2/quote/swap/now). */
    getSwapNowQuote(
        cointypesell: string,
        cointypebuy: string,
        amount: number
    ): Promise<QuoteResponse> {
        return this.post(
            '/quote/swap/now',
            { cointypesell, cointypebuy, amount },
            schemas.quote
        );
    }

    /** Place a market buy order (POST /api/v2/my/buy). */
    placeMarketBuyOrder(params: PlaceMarketBuyOrderParams): Promise<PlacedOrderResponse> {
        return this.post('/my/buy', params, schemas.placedOrder);
    }

    /** Edit an open market buy order (POST /api/v2/my/buy/edit). */
    editMarketBuyOrder(params: EditMarketBuyOrderParams): Promise<EditOrderResponse> {
        return this.post('/my/buy/edit', params, schemas.editedBuyOrder);
    }

    /** Execute a buy-now order at the current market rate (POST /api/v2/my/buy/now). */
    placeBuyNowOrder(params: BuyNowOrderParams): Promise<ExecutionResponse> {
        return this.post('/my/buy/now', params, schemas.buyNowExecution);
    }

    /** Place a market sell order (POST /api/v2/my/sell). */
    placeMarketSellOrder(params: PlaceMarketSellOrderParams): Promise<PlacedOrderResponse> {
        return this.post('/my/sell', params, schemas.placedOrder);
    }

    /** Edit an open market sell order (POST /api/v2/my/sell/edit). */
    editMarketSellOrder(params: EditMarketSellOrderParams): Promise<EditOrderResponse> {
        return this.post('/my/sell/edit', params, schemas.editedSellOrder);
    }

    /** Execute a sell-now order at the current market rate (POST /api/v2/my/sell/now). */
    placeSellNowOrder(params: SellNowOrderParams): Promise<ExecutionResponse> {
        return this.post('/my/sell/now', params, schemas.sellNowExecution);
    }

    /** Execute a swap-now order between two coins (POST /api/v2/my/swap/now). */
    placeSwapNowOrder(params: SwapNowOrderParams): Promise<ExecutionResponse> {
        return this.post('/my/swap/now', params, schemas.swapNowExecution);
    }

    /** Cancel a single buy order (POST /api/v2/my/buy/cancel). */
    cancelBuyOrder(id: string): Promise<CancellationResponse> {
        return this.post('/my/buy/cancel', { id }, schemas.cancel);
    }

    /** Cancel all open buy orders, optionally filtered by coin (POST /api/v2/my/buy/cancel/all). */
    cancelAllBuyOrders(params: CancelOrdersParams = {}): Promise<CancellationResponse> {
        return this.post('/my/buy/cancel/all', params, schemas.cancel);
    }

    /** Cancel a single sell order (POST /api/v2/my/sell/cancel). */
    cancelSellOrder(id: string): Promise<CancellationResponse> {
        return this.post('/my/sell/cancel', { id }, schemas.cancel);
    }

    /** Cancel all open sell orders, optionally filtered by coin (POST /api/v2/my/sell/cancel/all). */
    cancelAllSellOrders(params: CancelOrdersParams = {}): Promise<CancellationResponse> {
        return this.post('/my/sell/cancel/all', params, schemas.cancel);
    }

    /** List withdrawal details for a coin (POST /api/v2/my/coin/withdraw/senddetails). */
    getWithdrawalDetails(params: WithdrawalDetailsParams): Promise<WithdrawalDetailsResponse> {
        return this.post(
            '/my/coin/withdraw/senddetails',
            params,
            schemas.withdrawalDetails
        );
    }

    /** Send a coin withdrawal (POST /api/v2/my/coin/withdraw/send). */
    sendCoins(params: SendCoinsParams): Promise<SendCoinResponse> {
        return this.post('/my/coin/withdraw/send', params, schemas.sendCoins);
    }
}

export class CoinspotReadOnlyApi {
    constructor(
        private readonly transport: CoinspotTransport,
        private readonly baseUrl: string,
        private readonly nonceFactory: () => number,
        private readonly auth?: CoinspotCredential
    ) {}

    private ensureAuth(): CoinspotCredential {
        if (!this.auth) {
            throw new Error('Read-only API key/secret is required for this call');
        }
        return this.auth;
    }

    private sign(body: Record<string, unknown>, credential: CoinspotCredential): string {
        return crypto
            .createHmac('sha512', credential.secret)
            .update(JSON.stringify(body))
            .digest('hex');
    }

    private async post<T>(
        path: string,
        body: Record<string, unknown>,
        schema: (typeof schemas)[keyof typeof schemas]
    ): Promise<T> {
        const credential = this.ensureAuth();
        const payload = { nonce: this.nonceFactory(), ...body };
        const headers = {
            key: credential.key,
            sign: this.sign(payload, credential),
        };
        return this.transport.post<T>(`${this.baseUrl}${path}`, payload, headers, schema);
    }

    /** Status heartbeat for read-only key (POST /api/v2/ro/status). */
    getStatus(): Promise<StatusResponse> {
        return this.post('/status', {}, schemas.status);
    }

    /** Order book for a specific market (POST /api/v2/ro/orders/market/open). */
    getMarketOpenOrders(
        params: MarketOpenOrdersParams
    ): Promise<ReadOnlyMarketOrdersResponse> {
        return this.post('/orders/market/open', params, schemas.roMarketOrders);
    }

    /** Completed market orders with optional filters (POST /api/v2/ro/orders/market/completed). */
    getMarketCompletedOrders(
        params: MarketCompletedOrdersParams
    ): Promise<ReadOnlyMarketOrdersWithFeesResponse> {
        return this.post('/orders/market/completed', params, schemas.roMarketOrdersWithFees);
    }

    /** All balances for the account (POST /api/v2/ro/my/balances). */
    getBalances(): Promise<ReadOnlyBalancesResponse> {
        return this.post('/my/balances', {}, schemas.roBalances);
    }

    /** Balance for a specific coin (POST /api/v2/ro/my/balance/{cointype}?available=yes/no). */
    getBalanceForCoin(params: BalanceForCoinParams): Promise<ReadOnlyBalanceResponse> {
        const { cointype, available } = params;
        const query = available !== undefined ? `?available=${available ? 'yes' : 'no'}` : '';
        return this.post(
            `/my/balance/${encodeURIComponent(cointype)}${query}`,
            {},
            schemas.roBalanceForCoin
        );
    }

    /** Open market orders placed by the account (POST /api/v2/ro/my/orders/market/open). */
    getMyOpenMarketOrders(
        params: MyOpenMarketOrdersParams
    ): Promise<ReadOnlyMyOpenMarketOrdersResponse> {
        return this.post('/my/orders/market/open', params, schemas.roMyOpenMarketOrders);
    }

    /** Open limit orders placed by the account (POST /api/v2/ro/my/orders/limit/open). */
    getMyOpenLimitOrders(
        params: MyOpenLimitOrdersParams
    ): Promise<ReadOnlyMyOpenLimitOrdersResponse> {
        return this.post('/my/orders/limit/open', params, schemas.roMyOpenLimitOrders);
    }

    /** Completed order history (POST /api/v2/ro/my/orders/completed). */
    getMyOrdersHistory(
        params: MyOrdersHistoryParams
    ): Promise<ReadOnlyMyOrdersHistoryResponse> {
        return this.post('/my/orders/completed', params, schemas.roMyOrdersHistory);
    }

    /** Completed market order history (POST /api/v2/ro/my/orders/market/completed). */
    getMyMarketOrdersHistory(
        params: MyOrdersHistoryParams
    ): Promise<ReadOnlyMyMarketOrdersHistoryResponse> {
        return this.post('/my/orders/market/completed', params, schemas.roMyMarketOrdersHistory);
    }

    /** Send and receive history (POST /api/v2/ro/my/sendreceive). */
    getSendReceiveHistory(
        params: SendReceiveHistoryParams
    ): Promise<ReadOnlySendReceiveResponse> {
        return this.post('/my/sendreceive', params, schemas.roSendReceive);
    }

    /** AUD deposit history (POST /api/v2/ro/my/deposits). */
    getDepositHistory(params: FiatHistoryParams): Promise<ReadOnlyDepositsResponse> {
        return this.post('/my/deposits', params, schemas.roDeposits);
    }

    /** AUD withdrawal history (POST /api/v2/ro/my/withdrawals). */
    getWithdrawalHistory(params: FiatHistoryParams): Promise<ReadOnlyWithdrawalsResponse> {
        return this.post('/my/withdrawals', params, schemas.roWithdrawals);
    }

    /** Affiliate payments received (POST /api/v2/ro/my/affiliatepayments). */
    getAffiliatePayments(): Promise<ReadOnlyAffiliatePaymentsResponse> {
        return this.post('/my/affiliatepayments', {}, schemas.roAffiliatePayments);
    }

    /** Referral payments received (POST /api/v2/ro/my/referralpayments). */
    getReferralPayments(): Promise<ReadOnlyReferralPaymentsResponse> {
        return this.post('/my/referralpayments', {}, schemas.roReferralPayments);
    }
}

export { CoinspotHttpError, CoinspotSchemaError };
