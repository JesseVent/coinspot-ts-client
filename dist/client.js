"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinspotSchemaError = exports.CoinspotHttpError = exports.CoinspotReadOnlyApi = exports.CoinspotFullAccessApi = exports.CoinspotPublicApi = exports.CoinspotClient = void 0;
const node_crypto_1 = __importDefault(require("node:crypto"));
const node_https_1 = __importDefault(require("node:https"));
const node_url_1 = require("node:url");
const schemas_1 = require("./schemas");
const DEFAULT_BASE_URLS = {
    public: 'https://www.coinspot.com.au/pubapi/v2',
    private: 'https://www.coinspot.com.au/api/v2',
    readOnly: 'https://www.coinspot.com.au/api/v2/ro',
};
const DEFAULT_RATE_LIMIT = {
    maxRequests: 995,
    perSeconds: 60,
};
const DEFAULT_RETRIES = {
    maxRetries: 3,
    minDelayMs: 200,
    maxDelayMs: 2000,
    backoffFactor: 2,
};
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
class RateLimiter {
    constructor(options) {
        this.options = options;
        this.timestamps = [];
        this.queue = Promise.resolve();
        this.windowMs = options.perSeconds * 1000;
    }
    async schedule(fn) {
        const runner = async () => {
            await this.waitForSlot();
            return fn();
        };
        const next = this.queue.then(runner, runner);
        this.queue = next.catch(() => undefined);
        return next;
    }
    async waitForSlot() {
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
    constructor(message, statusCode, responseText) {
        super(message);
        this.statusCode = statusCode;
        this.responseText = responseText;
        this.name = 'CoinspotHttpError';
    }
}
exports.CoinspotHttpError = CoinspotHttpError;
class CoinspotSchemaError extends Error {
    constructor(message, issues, payload) {
        super(message);
        this.issues = issues;
        this.payload = payload;
        this.name = 'CoinspotSchemaError';
    }
}
exports.CoinspotSchemaError = CoinspotSchemaError;
class CoinspotTransport {
    constructor(config) {
        this.config = config;
    }
    async get(url, schema) {
        return this.schedule(() => this.retryableRequest('GET', url, undefined, {}, schema));
    }
    async post(url, body, headers, schema) {
        return this.schedule(() => this.retryableRequest('POST', url, body, headers, schema));
    }
    schedule(fn) {
        return this.config.rateLimiter.schedule(fn);
    }
    async retryableRequest(method, url, body, headers, schema) {
        let attempt = 0;
        let delay = this.config.retries.minDelayMs;
        let lastError;
        while (attempt <= this.config.retries.maxRetries) {
            try {
                return await this.execute(method, url, body, headers, schema);
            }
            catch (error) {
                lastError = error;
                const shouldRetry = error instanceof CoinspotHttpError
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
    async execute(method, url, body, headers, schema) {
        const payload = body ? JSON.stringify(body) : undefined;
        const target = new node_url_1.URL(url);
        const baseHeaders = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': this.config.userAgent,
            ...headers,
        };
        if (payload) {
            baseHeaders['Content-Length'] = Buffer.byteLength(payload);
        }
        const requestOptions = {
            method,
            hostname: target.hostname,
            path: `${target.pathname}${target.search}`,
            protocol: target.protocol,
            port: target.port || undefined,
            headers: baseHeaders,
            timeout: this.config.timeoutMs,
        };
        const responseText = await new Promise((resolve, reject) => {
            const req = node_https_1.default.request(requestOptions, (res) => {
                const chunks = [];
                res.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
                res.on('end', () => {
                    const text = Buffer.concat(chunks).toString('utf8');
                    const statusCode = res.statusCode ?? 0;
                    if (statusCode >= 200 && statusCode < 300) {
                        resolve(text);
                        return;
                    }
                    reject(new CoinspotHttpError(`Coinspot request failed with status ${statusCode}`, statusCode, text));
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
        let json;
        try {
            json = responseText ? JSON.parse(responseText) : {};
        }
        catch (error) {
            throw new Error(`Failed to parse Coinspot response: ${error.message}`);
        }
        const parsed = schema.safeParse(json);
        if (!parsed.success) {
            throw new CoinspotSchemaError('Coinspot response failed schema validation', parsed.error.issues, json);
        }
        return parsed.data;
    }
}
class CoinspotClient {
    constructor(options = {}) {
        this.options = options;
        this.baseUrls = {
            ...DEFAULT_BASE_URLS,
            ...options.baseUrls,
        };
        this.nonceFactory = options.nonceFactory ?? (() => Date.now());
        const rateLimiter = new RateLimiter(options.rateLimit ?? DEFAULT_RATE_LIMIT);
        this.transport = new CoinspotTransport({
            rateLimiter,
            retries: options.retries ?? DEFAULT_RETRIES,
            timeoutMs: options.timeoutMs ?? 15000,
            userAgent: options.userAgent ?? 'coinspot-ts-client/1.0.0',
        });
        this.public = new CoinspotPublicApi(this.transport, this.baseUrls.public);
        this.fullAccess = new CoinspotFullAccessApi(this.transport, this.baseUrls.private, this.nonceFactory, options.fullAccess);
        this.readOnly = new CoinspotReadOnlyApi(this.transport, this.baseUrls.readOnly, this.nonceFactory, options.readOnly ?? options.fullAccess);
    }
}
exports.CoinspotClient = CoinspotClient;
class CoinspotPublicApi {
    constructor(transport, baseUrl) {
        this.transport = transport;
        this.baseUrl = baseUrl;
    }
    /** Latest buy/sell/last prices for every market (GET /pubapi/v2/latest). */
    getLatestPrices() {
        return this.transport.get(`${this.baseUrl}/latest`, schemas_1.schemas.latestPrices);
    }
    /** Latest prices for a specific coin (GET /pubapi/v2/latest/{cointype}). */
    getLatestPricesForCoin(cointype) {
        return this.transport.get(`${this.baseUrl}/latest/${encodeURIComponent(cointype)}`, schemas_1.schemas.latestCoinPrices);
    }
    /** Latest prices for a specific coin/market pair (GET /pubapi/v2/latest/{cointype}/{markettype}). */
    getLatestPricesForCoinMarket(cointype, markettype) {
        return this.transport.get(`${this.baseUrl}/latest/${encodeURIComponent(cointype)}/${encodeURIComponent(markettype)}`, schemas_1.schemas.latestCoinPrices);
    }
    /** Latest buy price for a coin in AUD (GET /pubapi/v2/buyprice/{cointype}). */
    getLatestBuyPrice(cointype) {
        return this.transport.get(`${this.baseUrl}/buyprice/${encodeURIComponent(cointype)}`, schemas_1.schemas.latestRate);
    }
    /** Latest buy price for a coin in a non-AUD market (GET /pubapi/v2/buyprice/{cointype}/{markettype}). */
    getLatestBuyPriceInMarket(cointype, markettype) {
        return this.transport.get(`${this.baseUrl}/buyprice/${encodeURIComponent(cointype)}/${encodeURIComponent(markettype)}`, schemas_1.schemas.latestRate);
    }
    /** Latest sell price for a coin in AUD (GET /pubapi/v2/sellprice/{cointype}). */
    getLatestSellPrice(cointype) {
        return this.transport.get(`${this.baseUrl}/sellprice/${encodeURIComponent(cointype)}`, schemas_1.schemas.latestRate);
    }
    /** Latest sell price for a coin in a non-AUD market (GET /pubapi/v2/sellprice/{cointype}/{markettype}). */
    getLatestSellPriceInMarket(cointype, markettype) {
        return this.transport.get(`${this.baseUrl}/sellprice/${encodeURIComponent(cointype)}/${encodeURIComponent(markettype)}`, schemas_1.schemas.latestRate);
    }
    /** Top buy/sell orders for a coin in AUD (GET /pubapi/v2/orders/open/{cointype}). */
    getOpenOrders(cointype) {
        return this.transport.get(`${this.baseUrl}/orders/open/${encodeURIComponent(cointype)}`, schemas_1.schemas.orderBook);
    }
    /** Top buy/sell orders for a coin/market pair (GET /pubapi/v2/orders/open/{cointype}/{markettype}). */
    getOpenOrdersForMarket(cointype, markettype) {
        return this.transport.get(`${this.baseUrl}/orders/open/${encodeURIComponent(cointype)}/${encodeURIComponent(markettype)}`, schemas_1.schemas.orderBook);
    }
    /** Completed buy/sell orders for a coin in AUD (GET /pubapi/v2/orders/completed/{cointype}). */
    getCompletedOrders(cointype) {
        return this.transport.get(`${this.baseUrl}/orders/completed/${encodeURIComponent(cointype)}`, schemas_1.schemas.completedOrders);
    }
    /** Completed buy/sell orders for a coin/market pair (GET /pubapi/v2/orders/completed/{cointype}/{markettype}). */
    getCompletedOrdersForMarket(cointype, markettype) {
        return this.transport.get(`${this.baseUrl}/orders/completed/${encodeURIComponent(cointype)}/${encodeURIComponent(markettype)}`, schemas_1.schemas.completedOrders);
    }
    /** Completed orders summary for a coin in AUD (GET /pubapi/v2/orders/summary/completed/{cointype}). */
    getCompletedOrdersSummary(cointype) {
        return this.transport.get(`${this.baseUrl}/orders/summary/completed/${encodeURIComponent(cointype)}`, schemas_1.schemas.completedOrdersSummary);
    }
    /** Completed orders summary for a coin/market pair (GET /pubapi/v2/orders/summary/completed/{cointype}/{markettype}). */
    getCompletedOrdersSummaryForMarket(cointype, markettype) {
        return this.transport.get(`${this.baseUrl}/orders/summary/completed/${encodeURIComponent(cointype)}/${encodeURIComponent(markettype)}`, schemas_1.schemas.completedOrdersSummary);
    }
}
exports.CoinspotPublicApi = CoinspotPublicApi;
class CoinspotFullAccessApi {
    constructor(transport, baseUrl, nonceFactory, auth) {
        this.transport = transport;
        this.baseUrl = baseUrl;
        this.nonceFactory = nonceFactory;
        this.auth = auth;
    }
    ensureAuth() {
        if (!this.auth) {
            throw new Error('Full access API key/secret is required for this call');
        }
        return this.auth;
    }
    sign(body, credential) {
        return node_crypto_1.default
            .createHmac('sha512', credential.secret)
            .update(JSON.stringify(body))
            .digest('hex');
    }
    async post(path, body, schema) {
        const credential = this.ensureAuth();
        const payload = { nonce: this.nonceFactory(), ...body };
        const headers = {
            key: credential.key,
            sign: this.sign(payload, credential),
        };
        return this.transport.post(`${this.baseUrl}${path}`, payload, headers, schema);
    }
    /** Status heartbeat for full-access key (POST /api/v2/status). */
    getStatus() {
        return this.post('/status', {}, schemas_1.schemas.status);
    }
    /** Retrieve deposit addresses for a coin (POST /api/v2/my/coin/deposit). */
    getDepositAddresses(cointype) {
        return this.post('/my/coin/deposit', { cointype }, schemas_1.schemas.depositAddresses);
    }
    /** Quote a buy-now order (POST /api/v2/quote/buy/now). */
    getBuyNowQuote(cointype, amount, amounttype) {
        return this.post('/quote/buy/now', { cointype, amount, amounttype }, schemas_1.schemas.quote);
    }
    /** Quote a sell-now order (POST /api/v2/quote/sell/now). */
    getSellNowQuote(cointype, amount, amounttype) {
        return this.post('/quote/sell/now', { cointype, amount, amounttype }, schemas_1.schemas.quote);
    }
    /** Quote a swap-now order (POST /api/v2/quote/swap/now). */
    getSwapNowQuote(cointypesell, cointypebuy, amount) {
        return this.post('/quote/swap/now', { cointypesell, cointypebuy, amount }, schemas_1.schemas.quote);
    }
    /** Place a market buy order (POST /api/v2/my/buy). */
    placeMarketBuyOrder(params) {
        return this.post('/my/buy', params, schemas_1.schemas.placedOrder);
    }
    /** Edit an open market buy order (POST /api/v2/my/buy/edit). */
    editMarketBuyOrder(params) {
        return this.post('/my/buy/edit', params, schemas_1.schemas.editedBuyOrder);
    }
    /** Execute a buy-now order at the current market rate (POST /api/v2/my/buy/now). */
    placeBuyNowOrder(params) {
        return this.post('/my/buy/now', params, schemas_1.schemas.buyNowExecution);
    }
    /** Place a market sell order (POST /api/v2/my/sell). */
    placeMarketSellOrder(params) {
        return this.post('/my/sell', params, schemas_1.schemas.placedOrder);
    }
    /** Edit an open market sell order (POST /api/v2/my/sell/edit). */
    editMarketSellOrder(params) {
        return this.post('/my/sell/edit', params, schemas_1.schemas.editedSellOrder);
    }
    /** Execute a sell-now order at the current market rate (POST /api/v2/my/sell/now). */
    placeSellNowOrder(params) {
        return this.post('/my/sell/now', params, schemas_1.schemas.sellNowExecution);
    }
    /** Execute a swap-now order between two coins (POST /api/v2/my/swap/now). */
    placeSwapNowOrder(params) {
        return this.post('/my/swap/now', params, schemas_1.schemas.swapNowExecution);
    }
    /** Cancel a single buy order (POST /api/v2/my/buy/cancel). */
    cancelBuyOrder(id) {
        return this.post('/my/buy/cancel', { id }, schemas_1.schemas.cancel);
    }
    /** Cancel all open buy orders, optionally filtered by coin (POST /api/v2/my/buy/cancel/all). */
    cancelAllBuyOrders(params = {}) {
        return this.post('/my/buy/cancel/all', params, schemas_1.schemas.cancel);
    }
    /** Cancel a single sell order (POST /api/v2/my/sell/cancel). */
    cancelSellOrder(id) {
        return this.post('/my/sell/cancel', { id }, schemas_1.schemas.cancel);
    }
    /** Cancel all open sell orders, optionally filtered by coin (POST /api/v2/my/sell/cancel/all). */
    cancelAllSellOrders(params = {}) {
        return this.post('/my/sell/cancel/all', params, schemas_1.schemas.cancel);
    }
    /** List withdrawal details for a coin (POST /api/v2/my/coin/withdraw/senddetails). */
    getWithdrawalDetails(params) {
        return this.post('/my/coin/withdraw/senddetails', params, schemas_1.schemas.withdrawalDetails);
    }
    /** Send a coin withdrawal (POST /api/v2/my/coin/withdraw/send). */
    sendCoins(params) {
        return this.post('/my/coin/withdraw/send', params, schemas_1.schemas.sendCoins);
    }
}
exports.CoinspotFullAccessApi = CoinspotFullAccessApi;
class CoinspotReadOnlyApi {
    constructor(transport, baseUrl, nonceFactory, auth) {
        this.transport = transport;
        this.baseUrl = baseUrl;
        this.nonceFactory = nonceFactory;
        this.auth = auth;
    }
    ensureAuth() {
        if (!this.auth) {
            throw new Error('Read-only API key/secret is required for this call');
        }
        return this.auth;
    }
    sign(body, credential) {
        return node_crypto_1.default
            .createHmac('sha512', credential.secret)
            .update(JSON.stringify(body))
            .digest('hex');
    }
    async post(path, body, schema) {
        const credential = this.ensureAuth();
        const payload = { nonce: this.nonceFactory(), ...body };
        const headers = {
            key: credential.key,
            sign: this.sign(payload, credential),
        };
        return this.transport.post(`${this.baseUrl}${path}`, payload, headers, schema);
    }
    /** Status heartbeat for read-only key (POST /api/v2/ro/status). */
    getStatus() {
        return this.post('/status', {}, schemas_1.schemas.status);
    }
    /** Order book for a specific market (POST /api/v2/ro/orders/market/open). */
    getMarketOpenOrders(params) {
        return this.post('/orders/market/open', params, schemas_1.schemas.roMarketOrders);
    }
    /** Completed market orders with optional filters (POST /api/v2/ro/orders/market/completed). */
    getMarketCompletedOrders(params) {
        return this.post('/orders/market/completed', params, schemas_1.schemas.roMarketOrdersWithFees);
    }
    /** All balances for the account (POST /api/v2/ro/my/balances). */
    getBalances() {
        return this.post('/my/balances', {}, schemas_1.schemas.roBalances);
    }
    /** Balance for a specific coin (POST /api/v2/ro/my/balance/{cointype}?available=yes/no). */
    getBalanceForCoin(params) {
        const { cointype, available } = params;
        const query = available !== undefined ? `?available=${available ? 'yes' : 'no'}` : '';
        return this.post(`/my/balance/${encodeURIComponent(cointype)}${query}`, {}, schemas_1.schemas.roBalanceForCoin);
    }
    /** Open market orders placed by the account (POST /api/v2/ro/my/orders/market/open). */
    getMyOpenMarketOrders(params) {
        return this.post('/my/orders/market/open', params, schemas_1.schemas.roMyOpenMarketOrders);
    }
    /** Open limit orders placed by the account (POST /api/v2/ro/my/orders/limit/open). */
    getMyOpenLimitOrders(params) {
        return this.post('/my/orders/limit/open', params, schemas_1.schemas.roMyOpenLimitOrders);
    }
    /** Completed order history (POST /api/v2/ro/my/orders/completed). */
    getMyOrdersHistory(params) {
        return this.post('/my/orders/completed', params, schemas_1.schemas.roMyOrdersHistory);
    }
    /** Completed market order history (POST /api/v2/ro/my/orders/market/completed). */
    getMyMarketOrdersHistory(params) {
        return this.post('/my/orders/market/completed', params, schemas_1.schemas.roMyMarketOrdersHistory);
    }
    /** Send and receive history (POST /api/v2/ro/my/sendreceive). */
    getSendReceiveHistory(params) {
        return this.post('/my/sendreceive', params, schemas_1.schemas.roSendReceive);
    }
    /** AUD deposit history (POST /api/v2/ro/my/deposits). */
    getDepositHistory(params) {
        return this.post('/my/deposits', params, schemas_1.schemas.roDeposits);
    }
    /** AUD withdrawal history (POST /api/v2/ro/my/withdrawals). */
    getWithdrawalHistory(params) {
        return this.post('/my/withdrawals', params, schemas_1.schemas.roWithdrawals);
    }
    /** Affiliate payments received (POST /api/v2/ro/my/affiliatepayments). */
    getAffiliatePayments() {
        return this.post('/my/affiliatepayments', {}, schemas_1.schemas.roAffiliatePayments);
    }
    /** Referral payments received (POST /api/v2/ro/my/referralpayments). */
    getReferralPayments() {
        return this.post('/my/referralpayments', {}, schemas_1.schemas.roReferralPayments);
    }
}
exports.CoinspotReadOnlyApi = CoinspotReadOnlyApi;
