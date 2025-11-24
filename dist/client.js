"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinspotSchemaError = exports.CoinspotHttpError = exports.CoinspotReadOnlyApi = exports.CoinspotFullAccessApi = exports.CoinspotPublicApi = exports.CoinspotClient = void 0;
const crypto_1 = __importDefault(require("crypto"));
const https_1 = __importDefault(require("https"));
const url_1 = require("url");
const schemas_1 = require("./schemas");
const DEFAULT_BASE_URLS = {
    public: "https://www.coinspot.com.au/pubapi/v2",
    private: "https://www.coinspot.com.au/api/v2",
    readOnly: "https://www.coinspot.com.au/api/v2/ro",
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
const normalizeMarket = (market) => market.toLowerCase();
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
            while (this.timestamps.length &&
                now - this.timestamps[0] > this.windowMs) {
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
        this.name = "CoinspotHttpError";
    }
}
exports.CoinspotHttpError = CoinspotHttpError;
class CoinspotSchemaError extends Error {
    constructor(message, issues, payload) {
        super(message);
        this.issues = issues;
        this.payload = payload;
        this.name = "CoinspotSchemaError";
    }
}
exports.CoinspotSchemaError = CoinspotSchemaError;
class CoinspotTransport {
    constructor(config) {
        this.config = config;
    }
    async get(url, schema) {
        return this.schedule(() => this.retryableRequest("GET", url, undefined, {}, schema));
    }
    async post(url, body, headers, schema) {
        return this.schedule(() => this.retryableRequest("POST", url, body, headers, schema));
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
        const target = new url_1.URL(url);
        const baseHeaders = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "User-Agent": this.config.userAgent,
            ...headers,
        };
        if (payload) {
            baseHeaders["Content-Length"] = Buffer.byteLength(payload);
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
            const req = https_1.default.request(requestOptions, (res) => {
                const chunks = [];
                res.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
                res.on("end", () => {
                    const text = Buffer.concat(chunks).toString("utf8");
                    const statusCode = res.statusCode ?? 0;
                    if (statusCode >= 200 && statusCode < 300) {
                        resolve(text);
                        return;
                    }
                    reject(new CoinspotHttpError(`Coinspot request failed with status ${statusCode}`, statusCode, text));
                });
            });
            req.on("error", reject);
            req.on("timeout", () => {
                req.destroy(new Error("Coinspot request timed out"));
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
            throw new CoinspotSchemaError("Coinspot response failed schema validation", parsed.error.issues, json);
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
            userAgent: options.userAgent ?? "coinspot-ts-client/1.0.0",
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
    /** Binance-style ticker24hr for all markets (GET /pubapi/v2/latest). */
    ticker24hr() {
        return this.transport.get(`${this.baseUrl}/latest`, schemas_1.schemas.ticker24hr);
    }
    /** Binance-style ticker24hr scoped to a symbol (GET /pubapi/v2/latest/{cointype}). */
    ticker24hrForSymbol(symbol) {
        return this.transport.get(`${this.baseUrl}/latest/${encodeURIComponent(symbol)}`, schemas_1.schemas.ticker24hrSymbol);
    }
    /** Binance-style ticker24hr for a symbol/quote pair (GET /pubapi/v2/latest/{cointype}/{markettype}). */
    ticker24hrForMarket(symbol, quote) {
        return this.transport.get(`${this.baseUrl}/latest/${encodeURIComponent(symbol)}/${encodeURIComponent(normalizeMarket(quote))}`, schemas_1.schemas.ticker24hrSymbol);
    }
    /** Binance avgPrice equivalent using buy price (GET /pubapi/v2/buyprice/{cointype}). */
    avgPrice(symbol) {
        return this.transport.get(`${this.baseUrl}/buyprice/${encodeURIComponent(symbol)}`, schemas_1.schemas.avgPrice);
    }
    /** Binance avgPrice equivalent for a quote market (GET /pubapi/v2/buyprice/{cointype}/{markettype}). */
    avgPriceForMarket(symbol, quote) {
        return this.transport.get(`${this.baseUrl}/buyprice/${encodeURIComponent(symbol)}/${encodeURIComponent(normalizeMarket(quote))}`, schemas_1.schemas.avgPrice);
    }
    /** Binance bookTicker bid side using CoinSpot sell price (GET /pubapi/v2/sellprice/{cointype}). */
    bookTickerBid(symbol) {
        return this.transport.get(`${this.baseUrl}/sellprice/${encodeURIComponent(symbol)}`, schemas_1.schemas.avgPrice);
    }
    /** Binance bookTicker bid side with quote market (GET /pubapi/v2/sellprice/{cointype}/{markettype}). */
    bookTickerBidForMarket(symbol, quote) {
        return this.transport.get(`${this.baseUrl}/sellprice/${encodeURIComponent(symbol)}/${encodeURIComponent(normalizeMarket(quote))}`, schemas_1.schemas.avgPrice);
    }
    /** Binance depth equivalent for AUD market (GET /pubapi/v2/orders/open/{cointype}). */
    depth(symbol) {
        return this.transport.get(`${this.baseUrl}/orders/open/${encodeURIComponent(symbol)}`, schemas_1.schemas.depth);
    }
    /** Binance depth equivalent for a symbol/quote market (GET /pubapi/v2/orders/open/{cointype}/{markettype}). */
    depthForMarket(symbol, quote) {
        return this.transport.get(`${this.baseUrl}/orders/open/${encodeURIComponent(symbol)}/${encodeURIComponent(normalizeMarket(quote))}`, schemas_1.schemas.depth);
    }
    /** Binance trades equivalent (GET /pubapi/v2/orders/completed/{cointype}). */
    trades(symbol) {
        return this.transport.get(`${this.baseUrl}/orders/completed/${encodeURIComponent(symbol)}`, schemas_1.schemas.trades);
    }
    /** Binance trades equivalent for a market pair (GET /pubapi/v2/orders/completed/{cointype}/{markettype}). */
    tradesForMarket(symbol, quote) {
        return this.transport.get(`${this.baseUrl}/orders/completed/${encodeURIComponent(symbol)}/${encodeURIComponent(normalizeMarket(quote))}`, schemas_1.schemas.trades);
    }
    /** Binance aggTrades style summary (GET /pubapi/v2/orders/summary/completed/{cointype}). */
    aggTrades(symbol) {
        return this.transport.get(`${this.baseUrl}/orders/summary/completed/${encodeURIComponent(symbol)}`, schemas_1.schemas.aggTrades);
    }
    /** Binance aggTrades style summary for a market pair (GET /pubapi/v2/orders/summary/completed/{cointype}/{markettype}). */
    aggTradesForMarket(symbol, quote) {
        return this.transport.get(`${this.baseUrl}/orders/summary/completed/${encodeURIComponent(symbol)}/${encodeURIComponent(normalizeMarket(quote))}`, schemas_1.schemas.aggTrades);
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
            throw new Error("Full access API key/secret is required for this call");
        }
        return this.auth;
    }
    sign(body, credential) {
        return crypto_1.default
            .createHmac("sha512", credential.secret)
            .update(JSON.stringify(body))
            .digest("hex");
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
    /** Binance account equivalent (POST /api/v2/status). */
    account() {
        return this.post("/status", {}, schemas_1.schemas.account);
    }
    /** Binance capitalDepositAddress equivalent (POST /api/v2/my/coin/deposit). */
    capitalDepositAddress(cointype) {
        return this.post("/my/coin/deposit", { cointype }, schemas_1.schemas.capitalDepositAddress);
    }
    /** Binance orderQuote buy variant (POST /api/v2/quote/buy/now). */
    orderQuoteBuy(cointype, amount, amounttype) {
        return this.post("/quote/buy/now", { cointype, amount, amounttype }, schemas_1.schemas.orderQuote);
    }
    /** Binance orderQuote sell variant (POST /api/v2/quote/sell/now). */
    orderQuoteSell(cointype, amount, amounttype) {
        return this.post("/quote/sell/now", { cointype, amount, amounttype }, schemas_1.schemas.orderQuote);
    }
    /** Binance orderQuote swap variant (POST /api/v2/quote/swap/now). */
    orderQuoteSwap(cointypesell, cointypebuy, amount) {
        return this.post("/quote/swap/now", { cointypesell, cointypebuy, amount }, schemas_1.schemas.orderQuote);
    }
    /** Binance order create for BUY side (POST /api/v2/my/buy). */
    createOrderBuy(params) {
        const payload = {
            ...params,
            markettype: params.markettype
                ? normalizeMarket(params.markettype)
                : undefined,
        };
        return this.post("/my/buy", payload, schemas_1.schemas.newOrder);
    }
    /** Binance order update for BUY side (POST /api/v2/my/buy/edit). */
    updateOrderBuy(params) {
        const payload = {
            ...params,
            markettype: params.markettype
                ? normalizeMarket(params.markettype)
                : undefined,
        };
        return this.post("/my/buy/edit", payload, schemas_1.schemas.orderUpdateBuy);
    }
    /** Binance order submit for market BUY (POST /api/v2/my/buy/now). */
    orderMarketBuyNow(params) {
        return this.post("/my/buy/now", params, schemas_1.schemas.marketBuyExecution);
    }
    /** Binance order create for SELL side (POST /api/v2/my/sell). */
    createOrderSell(params) {
        const payload = {
            ...params,
            markettype: params.markettype
                ? normalizeMarket(params.markettype)
                : undefined,
        };
        return this.post("/my/sell", payload, schemas_1.schemas.newOrder);
    }
    /** Binance order update for SELL side (POST /api/v2/my/sell/edit). */
    updateOrderSell(params) {
        const payload = {
            ...params,
            markettype: params.markettype
                ? normalizeMarket(params.markettype)
                : undefined,
        };
        return this.post("/my/sell/edit", payload, schemas_1.schemas.orderUpdateSell);
    }
    /** Binance order submit for market SELL (POST /api/v2/my/sell/now). */
    orderMarketSellNow(params) {
        return this.post("/my/sell/now", params, schemas_1.schemas.marketSellExecution);
    }
    /** Binance order submit for swap (POST /api/v2/my/swap/now). */
    orderSwapNow(params) {
        return this.post("/my/swap/now", params, schemas_1.schemas.marketSwapExecution);
    }
    /** Binance cancelOrder for BUY (POST /api/v2/my/buy/cancel). */
    cancelOrderBuy(id) {
        return this.post("/my/buy/cancel", { id }, schemas_1.schemas.cancelOrder);
    }
    /** Binance cancelOpenOrders for BUY (POST /api/v2/my/buy/cancel/all). */
    cancelOpenOrdersBuy(params = {}) {
        return this.post("/my/buy/cancel/all", params, schemas_1.schemas.cancelOrder);
    }
    /** Binance cancelOrder for SELL (POST /api/v2/my/sell/cancel). */
    cancelOrderSell(id) {
        return this.post("/my/sell/cancel", { id }, schemas_1.schemas.cancelOrder);
    }
    /** Binance cancelOpenOrders for SELL (POST /api/v2/my/sell/cancel/all). */
    cancelOpenOrdersSell(params = {}) {
        return this.post("/my/sell/cancel/all", params, schemas_1.schemas.cancelOrder);
    }
    /** Binance withdraw details equivalent (POST /api/v2/my/coin/withdraw/senddetails). */
    withdrawDetails(params) {
        return this.post("/my/coin/withdraw/senddetails", params, schemas_1.schemas.withdrawDetails);
    }
    /** Binance withdraw submit (POST /api/v2/my/coin/withdraw/send). */
    withdraw(params) {
        return this.post("/my/coin/withdraw/send", params, schemas_1.schemas.withdraw);
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
            throw new Error("Read-only API key/secret is required for this call");
        }
        return this.auth;
    }
    sign(body, credential) {
        return crypto_1.default
            .createHmac("sha512", credential.secret)
            .update(JSON.stringify(body))
            .digest("hex");
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
    /** Binance account (readonly snapshot) (POST /api/v2/ro/status). */
    account() {
        return this.post("/status", {}, schemas_1.schemas.account);
    }
    /** Binance depth for market data (POST /api/v2/ro/orders/market/open). */
    marketDepth(params) {
        const payload = {
            ...params,
            markettype: params.markettype
                ? normalizeMarket(params.markettype)
                : undefined,
        };
        return this.post("/orders/market/open", payload, schemas_1.schemas.marketDepth);
    }
    /** Binance trades with fees analogue (POST /api/v2/ro/orders/market/completed). */
    marketTrades(params) {
        const payload = {
            ...params,
            markettype: params.markettype
                ? normalizeMarket(params.markettype)
                : undefined,
        };
        return this.post("/orders/market/completed", payload, schemas_1.schemas.marketTradesWithFees);
    }
    /** Binance account balances snapshot (POST /api/v2/ro/my/balances). */
    accountBalances() {
        return this.post("/my/balances", {}, schemas_1.schemas.accountBalances);
    }
    /** Binance asset balance (POST /api/v2/ro/my/balance/{cointype}?available=yes/no). */
    assetBalance(params) {
        const { cointype, available } = params;
        const query = available !== undefined ? `?available=${available ? "yes" : "no"}` : "";
        return this.post(`/my/balance/${encodeURIComponent(cointype)}${query}`, {}, schemas_1.schemas.assetBalance);
    }
    /** Binance openOrders (market) (POST /api/v2/ro/my/orders/market/open). */
    openMarketOrders(params) {
        const payload = {
            ...params,
            markettype: params.markettype
                ? normalizeMarket(params.markettype)
                : undefined,
        };
        return this.post("/my/orders/market/open", payload, schemas_1.schemas.openMarketOrders);
    }
    /** Binance openOrders (limit) (POST /api/v2/ro/my/orders/limit/open). */
    openLimitOrders(params) {
        return this.post("/my/orders/limit/open", params, schemas_1.schemas.openLimitOrders);
    }
    /** Binance allOrders (POST /api/v2/ro/my/orders/completed). */
    allOrders(params) {
        const payload = {
            ...params,
            markettype: params.markettype
                ? normalizeMarket(params.markettype)
                : undefined,
        };
        return this.post("/my/orders/completed", payload, schemas_1.schemas.allOrders);
    }
    /** Binance allOrders for market side (POST /api/v2/ro/my/orders/market/completed). */
    allMarketOrders(params) {
        const payload = {
            ...params,
            markettype: params.markettype
                ? normalizeMarket(params.markettype)
                : undefined,
        };
        return this.post("/my/orders/market/completed", payload, schemas_1.schemas.allMarketOrders);
    }
    /** Binance capital transfer history analogue (POST /api/v2/ro/my/sendreceive). */
    transferHistory(params) {
        return this.post("/my/sendreceive", params, schemas_1.schemas.transferHistory);
    }
    /** Fiat deposit history (POST /api/v2/ro/my/deposits). */
    fiatDepositHistory(params) {
        return this.post("/my/deposits", params, schemas_1.schemas.fiatDepositHistory);
    }
    /** Fiat withdrawal history (POST /api/v2/ro/my/withdrawals). */
    fiatWithdrawalHistory(params) {
        return this.post("/my/withdrawals", params, schemas_1.schemas.fiatWithdrawalHistory);
    }
    /** Affiliate payments received (POST /api/v2/ro/my/affiliatepayments). */
    affiliatePayments() {
        return this.post("/my/affiliatepayments", {}, schemas_1.schemas.affiliatePayments);
    }
    /** Referral payments received (POST /api/v2/ro/my/referralpayments). */
    referralPayments() {
        return this.post("/my/referralpayments", {}, schemas_1.schemas.referralPayments);
    }
}
exports.CoinspotReadOnlyApi = CoinspotReadOnlyApi;
