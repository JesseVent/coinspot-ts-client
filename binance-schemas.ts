// Binance-compatible schemas that extend CoinSpot schemas with Binance-style response formats
import { z } from 'zod';

const statusBaseSchema = z.object({
    status: z.string(),
});

const statusMessageSchema = statusBaseSchema.extend({
    message: z.string().optional(),
});

const numLike = z.preprocess((val: any) => {
    if (val === 'NaN') return null;
    if (typeof val === 'string') {
        const n = Number(val);
        return Number.isNaN(n) ? val : n;
    }
    return val;
}, z.number().nullable());

// Binance-specific schemas

const ticker24hrSymbolSchema = z.object({
    symbol: z.string(),
    priceChange: z.string().optional(),
    priceChangePercent: z.string().optional(),
    weightedAvgPrice: z.string().optional(),
    prevClosePrice: z.string().optional(),
    lastPrice: z.string(),
    lastQty: z.string().optional(),
    bidPrice: z.string(),
    bidQty: z.string().optional(),
    askPrice: z.string(),
    askQty: z.string().optional(),
    openPrice: z.string().optional(),
    highPrice: z.string().optional(),
    lowPrice: z.string().optional(),
    volume: z.string().optional(),
    quoteVolume: z.string().optional(),
    openTime: z.number().optional(),
    closeTime: z.number().optional(),
    firstId: z.number().optional(),
    lastId: z.number().optional(),
    count: z.number().optional(),
});

const avgPriceSchema = z.object({
    mins: z.number().optional(),
    price: z.string(),
});

const depthOrderSchema = z.tuple([z.string(), z.string()]);

const depthSchema = z.object({
    lastUpdateId: z.number(),
    bids: z.array(depthOrderSchema),
    asks: z.array(depthOrderSchema),
});

const tradeSchema = z.object({
    id: z.number(),
    price: z.string(),
    qty: z.string(),
    quoteQty: z.string(),
    time: z.number(),
    isBuyerMaker: z.boolean(),
    isBestMatch: z.boolean(),
});

const aggTradeSchema = z.object({
    a: z.number(), // Aggregate tradeId
    p: z.string(), // Price
    q: z.string(), // Quantity
    f: z.number(), // First tradeId
    l: z.number(), // Last tradeId
    T: z.number(), // Timestamp
    m: z.boolean(), // Was buyer the maker?
    M: z.boolean(), // Was this the best match?
});

const accountSchema = statusMessageSchema.extend({
    makerCommission: z.number().optional(),
    takerCommission: z.number().optional(),
    buyerCommission: z.number().optional(),
    sellerCommission: z.number().optional(),
    canTrade: z.boolean(),
    canWithdraw: z.boolean(),
    canDeposit: z.boolean(),
    updateTime: z.number().optional(),
    accountType: z.string().optional(),
    balances: z.array(
        z.object({
            asset: z.string(),
            free: z.string(),
            locked: z.string(),
        })
    ).optional(),
});

const capitalDepositAddressSchema = statusMessageSchema.extend({
    coin: z.string().optional(),
    address: z.string(),
    tag: z.string().optional(),
    url: z.string().optional(),
});

const orderQuoteSchema = statusMessageSchema.extend({
    symbol: z.string().optional(),
    price: z.string(),
    qty: z.string().optional(),
    quoteQty: z.string().optional(),
});

const newOrderSchema = statusMessageSchema.extend({
    symbol: z.string(),
    orderId: z.string(),
    orderListId: z.number().optional(),
    clientOrderId: z.string().optional(),
    transactTime: z.number().optional(),
    price: z.string(),
    origQty: z.string(),
    executedQty: z.string().optional(),
    cummulativeQuoteQty: z.string().optional(),
    status: z.string(),
    timeInForce: z.string().optional(),
    type: z.string().optional(),
    side: z.string(),
});

const orderUpdateSchema = statusMessageSchema.extend({
    symbol: z.string(),
    orderId: z.string(),
    orderListId: z.number().optional(),
    clientOrderId: z.string().optional(),
    price: z.string(),
    origQty: z.string(),
    executedQty: z.string().optional(),
    cummulativeQuoteQty: z.string().optional(),
    status: z.string(),
    timeInForce: z.string().optional(),
    type: z.string().optional(),
    side: z.string(),
});

const orderExecutionSchema = statusMessageSchema.extend({
    symbol: z.string(),
    orderId: z.string().optional(),
    orderListId: z.number().optional(),
    clientOrderId: z.string().optional(),
    transactTime: z.number().optional(),
    price: z.string(),
    origQty: z.string(),
    executedQty: z.string(),
    cummulativeQuoteQty: z.string(),
    status: z.string(),
    timeInForce: z.string().optional(),
    type: z.string().optional(),
    side: z.string(),
    fills: z.array(
        z.object({
            price: z.string(),
            qty: z.string(),
            commission: z.string().optional(),
            commissionAsset: z.string().optional(),
        })
    ).optional(),
});

const cancelOrderSchema = statusMessageSchema.extend({
    symbol: z.string().optional(),
    origClientOrderId: z.string().optional(),
    orderId: z.string().optional(),
    orderListId: z.number().optional(),
    clientOrderId: z.string().optional(),
    price: z.string().optional(),
    origQty: z.string().optional(),
    executedQty: z.string().optional(),
    cummulativeQuoteQty: z.string().optional(),
    status: z.string(),
    timeInForce: z.string().optional(),
    type: z.string().optional(),
    side: z.string().optional(),
});

const withdrawDetailsSchema = statusMessageSchema.extend({
    coin: z.string().optional(),
    minAmount: z.string().optional(),
    unlockConfirm: z.number().optional(),
    withdrawFee: z.string().optional(),
    withdrawMin: z.string().optional(),
    withdrawMax: z.string().optional(),
});

const withdrawSchema = statusMessageSchema.extend({
    id: z.string(),
    coin: z.string().optional(),
    amount: z.string().optional(),
    transactionFee: z.string().optional(),
    address: z.string().optional(),
    addressTag: z.string().optional(),
    txId: z.string().optional(),
    applyTime: z.string().optional(),
    network: z.string().optional(),
    transferType: z.number().optional(),
    withdrawOrderId: z.string().optional(),
    info: z.string().optional(),
    confirmNo: z.number().optional(),
});

const marketDepthSchema = depthSchema;

const marketTradeWithFeesSchema = z.object({
    id: z.number().optional(),
    price: z.string(),
    qty: z.string(),
    quoteQty: z.string(),
    time: z.number(),
    commission: z.string().optional(),
    commissionAsset: z.string().optional(),
});

const accountBalancesSchema = z.object({
    balances: z.array(
        z.object({
            asset: z.string(),
            free: z.string(),
            locked: z.string(),
        })
    ),
});

const assetBalanceSchema = z.object({
    asset: z.string(),
    free: z.string(),
    locked: z.string(),
});

const openMarketOrderSchema = z.object({
    symbol: z.string(),
    orderId: z.string(),
    orderListId: z.number().optional(),
    clientOrderId: z.string().optional(),
    price: z.string(),
    origQty: z.string(),
    executedQty: z.string().optional(),
    cummulativeQuoteQty: z.string().optional(),
    status: z.string(),
    timeInForce: z.string().optional(),
    type: z.string(),
    side: z.string(),
    stopPrice: z.string().optional(),
    icebergQty: z.string().optional(),
    time: z.number(),
    updateTime: z.number().optional(),
    isWorking: z.boolean().optional(),
    origQuoteOrderQty: z.string().optional(),
});

const openLimitOrderSchema = openMarketOrderSchema;

const allOrderSchema = openMarketOrderSchema;

const transferSchema = z.object({
    id: z.number().optional(),
    asset: z.string(),
    amount: z.string(),
    type: z.string(),
    status: z.string(),
    tranId: z.number().optional(),
    timestamp: z.number(),
    address: z.string().optional(),
    addressTag: z.string().optional(),
    txId: z.string().optional(),
});

const fiatDepositSchema = z.object({
    orderNo: z.string().optional(),
    fiatCurrency: z.string().optional(),
    indicatedAmount: z.string(),
    amount: z.string(),
    totalFee: z.string().optional(),
    method: z.string().optional(),
    status: z.string(),
    createTime: z.number().optional(),
    updateTime: z.number().optional(),
});

const fiatWithdrawalSchema = z.object({
    orderNo: z.string().optional(),
    fiatCurrency: z.string().optional(),
    indicatedAmount: z.string(),
    amount: z.string(),
    totalFee: z.string().optional(),
    method: z.string().optional(),
    status: z.string(),
    createTime: z.number().optional(),
    updateTime: z.number().optional(),
});

const affiliatePaymentSchema = z.object({
    amount: z.string(),
    asset: z.string().optional(),
    time: z.number().optional(),
    month: z.string().optional(),
});

const referralPaymentSchema = z.object({
    userId: z.string().optional(),
    registerTime: z.number().optional(),
    amount: z.string(),
    asset: z.string(),
    time: z.number(),
});

const symbolSchema = z.object({
    symbol: z.string(),
    status: z.string().optional(),
    baseAsset: z.string().optional(),
    baseAssetPrecision: z.number().optional(),
    quoteAsset: z.string().optional(),
    quotePrecision: z.number().optional(),
    quoteAssetPrecision: z.number().optional(),
    orderTypes: z.array(z.string()).optional(),
    icebergAllowed: z.boolean().optional(),
    ocoAllowed: z.boolean().optional(),
    isSpotTradingAllowed: z.boolean().optional(),
    isMarginTradingAllowed: z.boolean().optional(),
});

const latestPriceChartSchema = z.object({
    symbol: z.string(),
    price: z.string(),
    time: z.number().optional(),
});

export const schemas = {
    ticker24hr: z.array(ticker24hrSymbolSchema),
    ticker24hrSymbol: ticker24hrSymbolSchema,
    avgPrice: avgPriceSchema,
    depth: depthSchema,
    trades: z.array(tradeSchema),
    aggTrades: z.array(aggTradeSchema),
    account: accountSchema,
    capitalDepositAddress: capitalDepositAddressSchema,
    orderQuote: orderQuoteSchema,
    newOrder: newOrderSchema,
    orderUpdateBuy: orderUpdateSchema,
    orderUpdateSell: orderUpdateSchema,
    marketBuyExecution: orderExecutionSchema,
    marketSellExecution: orderExecutionSchema,
    marketSwapExecution: orderExecutionSchema,
    cancelOrder: cancelOrderSchema,
    withdrawDetails: withdrawDetailsSchema,
    withdraw: withdrawSchema,
    marketDepth: marketDepthSchema,
    marketTradesWithFees: z.array(marketTradeWithFeesSchema),
    accountBalances: accountBalancesSchema,
    assetBalance: assetBalanceSchema,
    openMarketOrders: z.array(openMarketOrderSchema),
    openLimitOrders: z.array(openLimitOrderSchema),
    allOrders: z.array(allOrderSchema),
    allMarketOrders: z.array(allOrderSchema),
    transferHistory: z.array(transferSchema),
    fiatDepositHistory: z.array(fiatDepositSchema),
    fiatWithdrawalHistory: z.array(fiatWithdrawalSchema),
    affiliatePayments: z.array(affiliatePaymentSchema),
    referralPayments: z.array(referralPaymentSchema),
    symbolsChart: z.array(symbolSchema),
    latestPriceChart: latestPriceChartSchema,
};

// Export response types
export type Ticker24hrResponse = z.infer<typeof schemas.ticker24hr>;
export type Ticker24hrSymbolResponse = z.infer<typeof schemas.ticker24hrSymbol>;
export type AvgPriceResponse = z.infer<typeof schemas.avgPrice>;
export type DepthResponse = z.infer<typeof schemas.depth>;
export type TradesResponse = z.infer<typeof schemas.trades>;
export type AggTradesResponse = z.infer<typeof schemas.aggTrades>;
export type AccountResponse = z.infer<typeof schemas.account>;
export type CapitalDepositAddressResponse = z.infer<typeof schemas.capitalDepositAddress>;
export type OrderQuoteResponse = z.infer<typeof schemas.orderQuote>;
export type NewOrderResponse = z.infer<typeof schemas.newOrder>;
export type OrderUpdateBuyResponse = z.infer<typeof schemas.orderUpdateBuy>;
export type OrderUpdateSellResponse = z.infer<typeof schemas.orderUpdateSell>;
export type OrderExecutionResponse = z.infer<typeof schemas.marketBuyExecution>;
export type CancelOrderResponse = z.infer<typeof schemas.cancelOrder>;
export type WithdrawDetailsResponse = z.infer<typeof schemas.withdrawDetails>;
export type WithdrawResponse = z.infer<typeof schemas.withdraw>;
export type MarketDepthResponse = z.infer<typeof schemas.marketDepth>;
export type MarketTradesWithFeesResponse = z.infer<typeof schemas.marketTradesWithFees>;
export type AccountBalancesResponse = z.infer<typeof schemas.accountBalances>;
export type AssetBalanceResponse = z.infer<typeof schemas.assetBalance>;
export type OpenMarketOrdersResponse = z.infer<typeof schemas.openMarketOrders>;
export type OpenLimitOrdersResponse = z.infer<typeof schemas.openLimitOrders>;
export type AllOrdersResponse = z.infer<typeof schemas.allOrders>;
export type AllMarketOrdersResponse = z.infer<typeof schemas.allMarketOrders>;
export type TransferHistoryResponse = z.infer<typeof schemas.transferHistory>;
export type FiatDepositHistoryResponse = z.infer<typeof schemas.fiatDepositHistory>;
export type FiatWithdrawalHistoryResponse = z.infer<typeof schemas.fiatWithdrawalHistory>;
export type AffiliatePaymentsResponse = z.infer<typeof schemas.affiliatePayments>;
export type ReferralPaymentsResponse = z.infer<typeof schemas.referralPayments>;
export type SymbolsChartResponse = z.infer<typeof schemas.symbolsChart>;
export type LatestPriceChartResponse = z.infer<typeof schemas.latestPriceChart>;
