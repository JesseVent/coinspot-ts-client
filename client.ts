import crypto from "crypto";
import https from "https";
import { URL } from "url";
import {
  AccountBalancesResponse,
  AccountResponse,
  AffiliatePaymentsResponse,
  AggTradesResponse,
  AllMarketOrdersResponse,
  AllOrdersResponse,
  AssetBalanceResponse,
  AvgPriceResponse,
  CancelOrderResponse,
  CapitalDepositAddressResponse,
  DepthResponse,
  FiatDepositHistoryResponse,
  FiatWithdrawalHistoryResponse,
  MarketDepthResponse,
  MarketTradesWithFeesResponse,
  NewOrderResponse,
  OpenLimitOrdersResponse,
  OpenMarketOrdersResponse,
  OrderExecutionResponse,
  OrderQuoteResponse,
  OrderUpdateBuyResponse,
  OrderUpdateSellResponse,
  ReferralPaymentsResponse,
  Ticker24hrResponse,
  Ticker24hrSymbolResponse,
  TradesResponse,
  TransferHistoryResponse,
  WithdrawDetailsResponse,
  WithdrawResponse,
  schemas,
} from "./schemas";

type HttpMethod = "GET" | "POST";

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
  public: "https://www.coinspot.com.au/pubapi/v2",
  private: "https://www.coinspot.com.au/api/v2",
  readOnly: "https://www.coinspot.com.au/api/v2/ro",
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

const normalizeMarket = (market: string) => market.toLowerCase();

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
      while (
        this.timestamps.length &&
        now - this.timestamps[0] > this.windowMs
      ) {
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
    public readonly responseText: string,
  ) {
    super(message);
    this.name = "CoinspotHttpError";
  }
}

class CoinspotSchemaError extends Error {
  constructor(
    message: string,
    public readonly issues: unknown,
    public readonly payload: unknown,
  ) {
    super(message);
    this.name = "CoinspotSchemaError";
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

  async get<T>(
    url: string,
    schema: (typeof schemas)[keyof typeof schemas],
  ): Promise<T> {
    return this.schedule(() =>
      this.retryableRequest<T>("GET", url, undefined, {}, schema),
    );
  }

  async post<T>(
    url: string,
    body: object,
    headers: Record<string, string>,
    schema: (typeof schemas)[keyof typeof schemas],
  ): Promise<T> {
    return this.schedule(() =>
      this.retryableRequest<T>("POST", url, body, headers, schema),
    );
  }

  private schedule<T>(fn: () => Promise<T>): Promise<T> {
    return this.config.rateLimiter.schedule(fn);
  }

  private async retryableRequest<T>(
    method: HttpMethod,
    url: string,
    body: object | undefined,
    headers: Record<string, string>,
    schema: (typeof schemas)[keyof typeof schemas],
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
    body: object | undefined,
    headers: Record<string, string>,
    schema: (typeof schemas)[keyof typeof schemas],
  ): Promise<T> {
    const payload = body ? JSON.stringify(body) : undefined;
    const target = new URL(url);

    const baseHeaders: Record<string, string | number> = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": this.config.userAgent,
      ...headers,
    };

    if (payload) {
      baseHeaders["Content-Length"] = Buffer.byteLength(payload);
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
        res.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
        res.on("end", () => {
          const text = Buffer.concat(chunks).toString("utf8");
          const statusCode = res.statusCode ?? 0;
          if (statusCode >= 200 && statusCode < 300) {
            resolve(text);
            return;
          }

          reject(
            new CoinspotHttpError(
              `Coinspot request failed with status ${statusCode}`,
              statusCode,
              text,
            ),
          );
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

    let json: unknown;
    try {
      json = responseText ? JSON.parse(responseText) : {};
    } catch (error) {
      throw new Error(
        `Failed to parse Coinspot response: ${(error as Error).message}`,
      );
    }

    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      throw new CoinspotSchemaError(
        "Coinspot response failed schema validation",
        parsed.error.issues,
        json,
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

    const rateLimiter = new RateLimiter(
      options.rateLimit ?? DEFAULT_RATE_LIMIT,
    );
    this.transport = new CoinspotTransport({
      rateLimiter,
      retries: options.retries ?? DEFAULT_RETRIES,
      timeoutMs: options.timeoutMs ?? 15_000,
      userAgent: options.userAgent ?? "coinspot-ts-client/1.0.0",
    });

    this.public = new CoinspotPublicApi(this.transport, this.baseUrls.public);
    this.fullAccess = new CoinspotFullAccessApi(
      this.transport,
      this.baseUrls.private,
      this.nonceFactory,
      options.fullAccess,
    );
    this.readOnly = new CoinspotReadOnlyApi(
      this.transport,
      this.baseUrls.readOnly,
      this.nonceFactory,
      options.readOnly ?? options.fullAccess,
    );
  }
}

export class CoinspotPublicApi {
  constructor(
    private readonly transport: CoinspotTransport,
    private readonly baseUrl: string,
  ) {}

  /** Binance-style ticker24hr for all markets (GET /pubapi/v2/latest). */
  ticker24hr(): Promise<Ticker24hrResponse> {
    return this.transport.get(`${this.baseUrl}/latest`, schemas.ticker24hr);
  }

  /** Binance-style ticker24hr scoped to a symbol (GET /pubapi/v2/latest/{cointype}). */
  ticker24hrForSymbol(symbol: string): Promise<Ticker24hrSymbolResponse> {
    return this.transport.get(
      `${this.baseUrl}/latest/${encodeURIComponent(symbol)}`,
      schemas.ticker24hrSymbol,
    );
  }

  /** Binance-style ticker24hr for a symbol/quote pair (GET /pubapi/v2/latest/{cointype}/{markettype}). */
  ticker24hrForMarket(
    symbol: string,
    quote: string,
  ): Promise<Ticker24hrSymbolResponse> {
    return this.transport.get(
      `${this.baseUrl}/latest/${encodeURIComponent(symbol)}/${encodeURIComponent(normalizeMarket(quote))}`,
      schemas.ticker24hrSymbol,
    );
  }

  /** Binance avgPrice equivalent using buy price (GET /pubapi/v2/buyprice/{cointype}). */
  avgPrice(symbol: string): Promise<AvgPriceResponse> {
    return this.transport.get(
      `${this.baseUrl}/buyprice/${encodeURIComponent(symbol)}`,
      schemas.avgPrice,
    );
  }

  /** Binance avgPrice equivalent for a quote market (GET /pubapi/v2/buyprice/{cointype}/{markettype}). */
  avgPriceForMarket(symbol: string, quote: string): Promise<AvgPriceResponse> {
    return this.transport.get(
      `${this.baseUrl}/buyprice/${encodeURIComponent(symbol)}/${encodeURIComponent(normalizeMarket(quote))}`,
      schemas.avgPrice,
    );
  }

  /** Binance bookTicker bid side using CoinSpot sell price (GET /pubapi/v2/sellprice/{cointype}). */
  bookTickerBid(symbol: string): Promise<AvgPriceResponse> {
    return this.transport.get(
      `${this.baseUrl}/sellprice/${encodeURIComponent(symbol)}`,
      schemas.avgPrice,
    );
  }

  /** Binance bookTicker bid side with quote market (GET /pubapi/v2/sellprice/{cointype}/{markettype}). */
  bookTickerBidForMarket(
    symbol: string,
    quote: string,
  ): Promise<AvgPriceResponse> {
    return this.transport.get(
      `${this.baseUrl}/sellprice/${encodeURIComponent(symbol)}/${encodeURIComponent(normalizeMarket(quote))}`,
      schemas.avgPrice,
    );
  }

  /** Binance depth equivalent for AUD market (GET /pubapi/v2/orders/open/{cointype}). */
  depth(symbol: string): Promise<DepthResponse> {
    return this.transport.get(
      `${this.baseUrl}/orders/open/${encodeURIComponent(symbol)}`,
      schemas.depth,
    );
  }

  /** Binance depth equivalent for a symbol/quote market (GET /pubapi/v2/orders/open/{cointype}/{markettype}). */
  depthForMarket(symbol: string, quote: string): Promise<DepthResponse> {
    return this.transport.get(
      `${this.baseUrl}/orders/open/${encodeURIComponent(symbol)}/${encodeURIComponent(normalizeMarket(quote))}`,
      schemas.depth,
    );
  }

  /** Binance trades equivalent (GET /pubapi/v2/orders/completed/{cointype}). */
  trades(symbol: string): Promise<TradesResponse> {
    return this.transport.get(
      `${this.baseUrl}/orders/completed/${encodeURIComponent(symbol)}`,
      schemas.trades,
    );
  }

  /** Binance trades equivalent for a market pair (GET /pubapi/v2/orders/completed/{cointype}/{markettype}). */
  tradesForMarket(symbol: string, quote: string): Promise<TradesResponse> {
    return this.transport.get(
      `${this.baseUrl}/orders/completed/${encodeURIComponent(symbol)}/${encodeURIComponent(normalizeMarket(quote))}`,
      schemas.trades,
    );
  }

  /** Binance aggTrades style summary (GET /pubapi/v2/orders/summary/completed/{cointype}). */
  aggTrades(symbol: string): Promise<AggTradesResponse> {
    return this.transport.get(
      `${this.baseUrl}/orders/summary/completed/${encodeURIComponent(symbol)}`,
      schemas.aggTrades,
    );
  }

  /** Binance aggTrades style summary for a market pair (GET /pubapi/v2/orders/summary/completed/{cointype}/{markettype}). */
  aggTradesForMarket(
    symbol: string,
    quote: string,
  ): Promise<AggTradesResponse> {
    return this.transport.get(
      `${this.baseUrl}/orders/summary/completed/${encodeURIComponent(symbol)}/${encodeURIComponent(normalizeMarket(quote))}`,
      schemas.aggTrades,
    );
  }
}

export class CoinspotFullAccessApi {
  constructor(
    private readonly transport: CoinspotTransport,
    private readonly baseUrl: string,
    private readonly nonceFactory: () => number,
    private readonly auth?: CoinspotCredential,
  ) {}

  private ensureAuth(): CoinspotCredential {
    if (!this.auth) {
      throw new Error("Full access API key/secret is required for this call");
    }
    return this.auth;
  }

  private sign(
    body: Record<string, unknown>,
    credential: CoinspotCredential,
  ): string {
    return crypto
      .createHmac("sha512", credential.secret)
      .update(JSON.stringify(body))
      .digest("hex");
  }

  private async post<T>(
    path: string,
    body: object,
    schema: (typeof schemas)[keyof typeof schemas],
  ): Promise<T> {
    const credential = this.ensureAuth();
    const payload = { nonce: this.nonceFactory(), ...body };
    const headers = {
      key: credential.key,
      sign: this.sign(payload, credential),
    };

    return this.transport.post<T>(
      `${this.baseUrl}${path}`,
      payload,
      headers,
      schema,
    );
  }

  /** Binance account equivalent (POST /api/v2/status). */
  account(): Promise<AccountResponse> {
    return this.post("/status", {}, schemas.account);
  }

  /** Binance capitalDepositAddress equivalent (POST /api/v2/my/coin/deposit). */
  capitalDepositAddress(
    cointype: string,
  ): Promise<CapitalDepositAddressResponse> {
    return this.post(
      "/my/coin/deposit",
      { cointype },
      schemas.capitalDepositAddress,
    );
  }

  /** Binance orderQuote buy variant (POST /api/v2/quote/buy/now). */
  orderQuoteBuy(
    cointype: string,
    amount: number,
    amounttype: "coin" | "aud",
  ): Promise<OrderQuoteResponse> {
    return this.post(
      "/quote/buy/now",
      { cointype, amount, amounttype },
      schemas.orderQuote,
    );
  }

  /** Binance orderQuote sell variant (POST /api/v2/quote/sell/now). */
  orderQuoteSell(
    cointype: string,
    amount: number,
    amounttype: "coin" | "aud",
  ): Promise<OrderQuoteResponse> {
    return this.post(
      "/quote/sell/now",
      { cointype, amount, amounttype },
      schemas.orderQuote,
    );
  }

  /** Binance orderQuote swap variant (POST /api/v2/quote/swap/now). */
  orderQuoteSwap(
    cointypesell: string,
    cointypebuy: string,
    amount: number,
  ): Promise<OrderQuoteResponse> {
    return this.post(
      "/quote/swap/now",
      { cointypesell, cointypebuy, amount },
      schemas.orderQuote,
    );
  }

  /** Binance order create for BUY side (POST /api/v2/my/buy). */
  createOrderBuy(params: NewBuyOrderParams): Promise<NewOrderResponse> {
    const payload = {
      ...params,
      markettype: params.markettype
        ? normalizeMarket(params.markettype)
        : undefined,
    };
    return this.post("/my/buy", payload, schemas.newOrder);
  }

  /** Binance order update for BUY side (POST /api/v2/my/buy/edit). */
  updateOrderBuy(
    params: UpdateBuyOrderParams,
  ): Promise<OrderUpdateBuyResponse> {
    const payload = {
      ...params,
      markettype: params.markettype
        ? normalizeMarket(params.markettype)
        : undefined,
    };
    return this.post("/my/buy/edit", payload, schemas.orderUpdateBuy);
  }

  /** Binance order submit for market BUY (POST /api/v2/my/buy/now). */
  orderMarketBuyNow(
    params: MarketBuyNowParams,
  ): Promise<OrderExecutionResponse> {
    return this.post("/my/buy/now", params, schemas.marketBuyExecution);
  }

  /** Binance order create for SELL side (POST /api/v2/my/sell). */
  createOrderSell(params: NewSellOrderParams): Promise<NewOrderResponse> {
    const payload = {
      ...params,
      markettype: params.markettype
        ? normalizeMarket(params.markettype)
        : undefined,
    };
    return this.post("/my/sell", payload, schemas.newOrder);
  }

  /** Binance order update for SELL side (POST /api/v2/my/sell/edit). */
  updateOrderSell(
    params: UpdateSellOrderParams,
  ): Promise<OrderUpdateSellResponse> {
    const payload = {
      ...params,
      markettype: params.markettype
        ? normalizeMarket(params.markettype)
        : undefined,
    };
    return this.post("/my/sell/edit", payload, schemas.orderUpdateSell);
  }

  /** Binance order submit for market SELL (POST /api/v2/my/sell/now). */
  orderMarketSellNow(
    params: MarketSellNowParams,
  ): Promise<OrderExecutionResponse> {
    return this.post("/my/sell/now", params, schemas.marketSellExecution);
  }

  /** Binance order submit for swap (POST /api/v2/my/swap/now). */
  orderSwapNow(params: MarketSwapNowParams): Promise<OrderExecutionResponse> {
    return this.post("/my/swap/now", params, schemas.marketSwapExecution);
  }

  /** Binance cancelOrder for BUY (POST /api/v2/my/buy/cancel). */
  cancelOrderBuy(id: string): Promise<CancelOrderResponse> {
    return this.post("/my/buy/cancel", { id }, schemas.cancelOrder);
  }

  /** Binance cancelOpenOrders for BUY (POST /api/v2/my/buy/cancel/all). */
  cancelOpenOrdersBuy(
    params: CancelOpenOrdersParams = {},
  ): Promise<CancelOrderResponse> {
    return this.post("/my/buy/cancel/all", params, schemas.cancelOrder);
  }

  /** Binance cancelOrder for SELL (POST /api/v2/my/sell/cancel). */
  cancelOrderSell(id: string): Promise<CancelOrderResponse> {
    return this.post("/my/sell/cancel", { id }, schemas.cancelOrder);
  }

  /** Binance cancelOpenOrders for SELL (POST /api/v2/my/sell/cancel/all). */
  cancelOpenOrdersSell(
    params: CancelOpenOrdersParams = {},
  ): Promise<CancelOrderResponse> {
    return this.post("/my/sell/cancel/all", params, schemas.cancelOrder);
  }

  /** Binance withdraw details equivalent (POST /api/v2/my/coin/withdraw/senddetails). */
  withdrawDetails(
    params: WithdrawDetailsParams,
  ): Promise<WithdrawDetailsResponse> {
    return this.post(
      "/my/coin/withdraw/senddetails",
      params,
      schemas.withdrawDetails,
    );
  }

  /** Binance withdraw submit (POST /api/v2/my/coin/withdraw/send). */
  withdraw(params: WithdrawRequestParams): Promise<WithdrawResponse> {
    return this.post("/my/coin/withdraw/send", params, schemas.withdraw);
  }
}

export class CoinspotReadOnlyApi {
  constructor(
    private readonly transport: CoinspotTransport,
    private readonly baseUrl: string,
    private readonly nonceFactory: () => number,
    private readonly auth?: CoinspotCredential,
  ) {}

  private ensureAuth(): CoinspotCredential {
    if (!this.auth) {
      throw new Error("Read-only API key/secret is required for this call");
    }
    return this.auth;
  }

  private sign(
    body: Record<string, unknown>,
    credential: CoinspotCredential,
  ): string {
    return crypto
      .createHmac("sha512", credential.secret)
      .update(JSON.stringify(body))
      .digest("hex");
  }

  private async post<T>(
    path: string,
    body: object,
    schema: (typeof schemas)[keyof typeof schemas],
  ): Promise<T> {
    const credential = this.ensureAuth();
    const payload = { nonce: this.nonceFactory(), ...body };
    const headers = {
      key: credential.key,
      sign: this.sign(payload, credential),
    };
    return this.transport.post<T>(
      `${this.baseUrl}${path}`,
      payload,
      headers,
      schema,
    );
  }

  /** Binance account (readonly snapshot) (POST /api/v2/ro/status). */
  account(): Promise<AccountResponse> {
    return this.post("/status", {}, schemas.account);
  }

  /** Binance depth for market data (POST /api/v2/ro/orders/market/open). */
  marketDepth(params: DepthParams): Promise<MarketDepthResponse> {
    const payload = {
      ...params,
      markettype: params.markettype
        ? normalizeMarket(params.markettype)
        : undefined,
    };
    return this.post("/orders/market/open", payload, schemas.marketDepth);
  }

  /** Binance trades with fees analogue (POST /api/v2/ro/orders/market/completed). */
  marketTrades(
    params: MarketTradesParams,
  ): Promise<MarketTradesWithFeesResponse> {
    const payload = {
      ...params,
      markettype: params.markettype
        ? normalizeMarket(params.markettype)
        : undefined,
    };
    return this.post(
      "/orders/market/completed",
      payload,
      schemas.marketTradesWithFees,
    );
  }

  /** Binance account balances snapshot (POST /api/v2/ro/my/balances). */
  accountBalances(): Promise<AccountBalancesResponse> {
    return this.post("/my/balances", {}, schemas.accountBalances);
  }

  /** Binance asset balance (POST /api/v2/ro/my/balance/{cointype}?available=yes/no). */
  assetBalance(params: AssetBalanceParams): Promise<AssetBalanceResponse> {
    const { cointype, available } = params;
    const query =
      available !== undefined ? `?available=${available ? "yes" : "no"}` : "";
    return this.post(
      `/my/balance/${encodeURIComponent(cointype)}${query}`,
      {},
      schemas.assetBalance,
    );
  }

  /** Binance openOrders (market) (POST /api/v2/ro/my/orders/market/open). */
  openMarketOrders(
    params: OpenOrdersParams,
  ): Promise<OpenMarketOrdersResponse> {
    const payload = {
      ...params,
      markettype: params.markettype
        ? normalizeMarket(params.markettype)
        : undefined,
    };
    return this.post(
      "/my/orders/market/open",
      payload,
      schemas.openMarketOrders,
    );
  }

  /** Binance openOrders (limit) (POST /api/v2/ro/my/orders/limit/open). */
  openLimitOrders(
    params: OpenLimitOrdersParams,
  ): Promise<OpenLimitOrdersResponse> {
    return this.post("/my/orders/limit/open", params, schemas.openLimitOrders);
  }

  /** Binance allOrders (POST /api/v2/ro/my/orders/completed). */
  allOrders(params: AllOrdersParams): Promise<AllOrdersResponse> {
    const payload = {
      ...params,
      markettype: params.markettype
        ? normalizeMarket(params.markettype)
        : undefined,
    };
    return this.post("/my/orders/completed", payload, schemas.allOrders);
  }

  /** Binance allOrders for market side (POST /api/v2/ro/my/orders/market/completed). */
  allMarketOrders(params: AllOrdersParams): Promise<AllMarketOrdersResponse> {
    const payload = {
      ...params,
      markettype: params.markettype
        ? normalizeMarket(params.markettype)
        : undefined,
    };
    return this.post(
      "/my/orders/market/completed",
      payload,
      schemas.allMarketOrders,
    );
  }

  /** Binance capital transfer history analogue (POST /api/v2/ro/my/sendreceive). */
  transferHistory(
    params: TransferHistoryParams,
  ): Promise<TransferHistoryResponse> {
    return this.post("/my/sendreceive", params, schemas.transferHistory);
  }

  /** Fiat deposit history (POST /api/v2/ro/my/deposits). */
  fiatDepositHistory(
    params: FiatHistoryParams,
  ): Promise<FiatDepositHistoryResponse> {
    return this.post("/my/deposits", params, schemas.fiatDepositHistory);
  }

  /** Fiat withdrawal history (POST /api/v2/ro/my/withdrawals). */
  fiatWithdrawalHistory(
    params: FiatHistoryParams,
  ): Promise<FiatWithdrawalHistoryResponse> {
    return this.post("/my/withdrawals", params, schemas.fiatWithdrawalHistory);
  }

  /** Affiliate payments received (POST /api/v2/ro/my/affiliatepayments). */
  affiliatePayments(): Promise<AffiliatePaymentsResponse> {
    return this.post("/my/affiliatepayments", {}, schemas.affiliatePayments);
  }

  /** Referral payments received (POST /api/v2/ro/my/referralpayments). */
  referralPayments(): Promise<ReferralPaymentsResponse> {
    return this.post("/my/referralpayments", {}, schemas.referralPayments);
  }
}

export { CoinspotHttpError, CoinspotSchemaError };
