"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemas = void 0;
// Binance-compatible schemas that extend CoinSpot schemas with Binance-style response formats
const zod_1 = require("zod");
const statusBaseSchema = zod_1.z.object({
    status: zod_1.z.string(),
});
const statusMessageSchema = statusBaseSchema.extend({
    message: zod_1.z.string().optional(),
});
const numLike = zod_1.z.preprocess((val) => {
    if (val === 'NaN')
        return null;
    if (typeof val === 'string') {
        const n = Number(val);
        return Number.isNaN(n) ? val : n;
    }
    return val;
}, zod_1.z.number().nullable());
// Binance-specific schemas
const ticker24hrSymbolSchema = zod_1.z.object({
    symbol: zod_1.z.string(),
    priceChange: zod_1.z.string().optional(),
    priceChangePercent: zod_1.z.string().optional(),
    weightedAvgPrice: zod_1.z.string().optional(),
    prevClosePrice: zod_1.z.string().optional(),
    lastPrice: zod_1.z.string(),
    lastQty: zod_1.z.string().optional(),
    bidPrice: zod_1.z.string(),
    bidQty: zod_1.z.string().optional(),
    askPrice: zod_1.z.string(),
    askQty: zod_1.z.string().optional(),
    openPrice: zod_1.z.string().optional(),
    highPrice: zod_1.z.string().optional(),
    lowPrice: zod_1.z.string().optional(),
    volume: zod_1.z.string().optional(),
    quoteVolume: zod_1.z.string().optional(),
    openTime: zod_1.z.number().optional(),
    closeTime: zod_1.z.number().optional(),
    firstId: zod_1.z.number().optional(),
    lastId: zod_1.z.number().optional(),
    count: zod_1.z.number().optional(),
});
const avgPriceSchema = zod_1.z.object({
    mins: zod_1.z.number().optional(),
    price: zod_1.z.string(),
});
const depthOrderSchema = zod_1.z.tuple([zod_1.z.string(), zod_1.z.string()]);
const depthSchema = zod_1.z.object({
    lastUpdateId: zod_1.z.number(),
    bids: zod_1.z.array(depthOrderSchema),
    asks: zod_1.z.array(depthOrderSchema),
});
const tradeSchema = zod_1.z.object({
    id: zod_1.z.number(),
    price: zod_1.z.string(),
    qty: zod_1.z.string(),
    quoteQty: zod_1.z.string(),
    time: zod_1.z.number(),
    isBuyerMaker: zod_1.z.boolean(),
    isBestMatch: zod_1.z.boolean(),
});
const aggTradeSchema = zod_1.z.object({
    a: zod_1.z.number(), // Aggregate tradeId
    p: zod_1.z.string(), // Price
    q: zod_1.z.string(), // Quantity
    f: zod_1.z.number(), // First tradeId
    l: zod_1.z.number(), // Last tradeId
    T: zod_1.z.number(), // Timestamp
    m: zod_1.z.boolean(), // Was buyer the maker?
    M: zod_1.z.boolean(), // Was this the best match?
});
const accountSchema = statusMessageSchema.extend({
    makerCommission: zod_1.z.number().optional(),
    takerCommission: zod_1.z.number().optional(),
    buyerCommission: zod_1.z.number().optional(),
    sellerCommission: zod_1.z.number().optional(),
    canTrade: zod_1.z.boolean(),
    canWithdraw: zod_1.z.boolean(),
    canDeposit: zod_1.z.boolean(),
    updateTime: zod_1.z.number().optional(),
    accountType: zod_1.z.string().optional(),
    balances: zod_1.z.array(zod_1.z.object({
        asset: zod_1.z.string(),
        free: zod_1.z.string(),
        locked: zod_1.z.string(),
    })).optional(),
});
const capitalDepositAddressSchema = statusMessageSchema.extend({
    coin: zod_1.z.string().optional(),
    address: zod_1.z.string(),
    tag: zod_1.z.string().optional(),
    url: zod_1.z.string().optional(),
});
const orderQuoteSchema = statusMessageSchema.extend({
    symbol: zod_1.z.string().optional(),
    price: zod_1.z.string(),
    qty: zod_1.z.string().optional(),
    quoteQty: zod_1.z.string().optional(),
});
const newOrderSchema = statusMessageSchema.extend({
    symbol: zod_1.z.string(),
    orderId: zod_1.z.string(),
    orderListId: zod_1.z.number().optional(),
    clientOrderId: zod_1.z.string().optional(),
    transactTime: zod_1.z.number().optional(),
    price: zod_1.z.string(),
    origQty: zod_1.z.string(),
    executedQty: zod_1.z.string().optional(),
    cummulativeQuoteQty: zod_1.z.string().optional(),
    status: zod_1.z.string(),
    timeInForce: zod_1.z.string().optional(),
    type: zod_1.z.string().optional(),
    side: zod_1.z.string(),
});
const orderUpdateSchema = statusMessageSchema.extend({
    symbol: zod_1.z.string(),
    orderId: zod_1.z.string(),
    orderListId: zod_1.z.number().optional(),
    clientOrderId: zod_1.z.string().optional(),
    price: zod_1.z.string(),
    origQty: zod_1.z.string(),
    executedQty: zod_1.z.string().optional(),
    cummulativeQuoteQty: zod_1.z.string().optional(),
    status: zod_1.z.string(),
    timeInForce: zod_1.z.string().optional(),
    type: zod_1.z.string().optional(),
    side: zod_1.z.string(),
});
const orderExecutionSchema = statusMessageSchema.extend({
    symbol: zod_1.z.string(),
    orderId: zod_1.z.string().optional(),
    orderListId: zod_1.z.number().optional(),
    clientOrderId: zod_1.z.string().optional(),
    transactTime: zod_1.z.number().optional(),
    price: zod_1.z.string(),
    origQty: zod_1.z.string(),
    executedQty: zod_1.z.string(),
    cummulativeQuoteQty: zod_1.z.string(),
    status: zod_1.z.string(),
    timeInForce: zod_1.z.string().optional(),
    type: zod_1.z.string().optional(),
    side: zod_1.z.string(),
    fills: zod_1.z.array(zod_1.z.object({
        price: zod_1.z.string(),
        qty: zod_1.z.string(),
        commission: zod_1.z.string().optional(),
        commissionAsset: zod_1.z.string().optional(),
    })).optional(),
});
const cancelOrderSchema = statusMessageSchema.extend({
    symbol: zod_1.z.string().optional(),
    origClientOrderId: zod_1.z.string().optional(),
    orderId: zod_1.z.string().optional(),
    orderListId: zod_1.z.number().optional(),
    clientOrderId: zod_1.z.string().optional(),
    price: zod_1.z.string().optional(),
    origQty: zod_1.z.string().optional(),
    executedQty: zod_1.z.string().optional(),
    cummulativeQuoteQty: zod_1.z.string().optional(),
    status: zod_1.z.string(),
    timeInForce: zod_1.z.string().optional(),
    type: zod_1.z.string().optional(),
    side: zod_1.z.string().optional(),
});
const withdrawDetailsSchema = statusMessageSchema.extend({
    coin: zod_1.z.string().optional(),
    minAmount: zod_1.z.string().optional(),
    unlockConfirm: zod_1.z.number().optional(),
    withdrawFee: zod_1.z.string().optional(),
    withdrawMin: zod_1.z.string().optional(),
    withdrawMax: zod_1.z.string().optional(),
});
const withdrawSchema = statusMessageSchema.extend({
    id: zod_1.z.string(),
    coin: zod_1.z.string().optional(),
    amount: zod_1.z.string().optional(),
    transactionFee: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    addressTag: zod_1.z.string().optional(),
    txId: zod_1.z.string().optional(),
    applyTime: zod_1.z.string().optional(),
    network: zod_1.z.string().optional(),
    transferType: zod_1.z.number().optional(),
    withdrawOrderId: zod_1.z.string().optional(),
    info: zod_1.z.string().optional(),
    confirmNo: zod_1.z.number().optional(),
});
const marketDepthSchema = depthSchema;
const marketTradeWithFeesSchema = zod_1.z.object({
    id: zod_1.z.number().optional(),
    price: zod_1.z.string(),
    qty: zod_1.z.string(),
    quoteQty: zod_1.z.string(),
    time: zod_1.z.number(),
    commission: zod_1.z.string().optional(),
    commissionAsset: zod_1.z.string().optional(),
});
const accountBalancesSchema = zod_1.z.object({
    balances: zod_1.z.array(zod_1.z.object({
        asset: zod_1.z.string(),
        free: zod_1.z.string(),
        locked: zod_1.z.string(),
    })),
});
const assetBalanceSchema = zod_1.z.object({
    asset: zod_1.z.string(),
    free: zod_1.z.string(),
    locked: zod_1.z.string(),
});
const openMarketOrderSchema = zod_1.z.object({
    symbol: zod_1.z.string(),
    orderId: zod_1.z.string(),
    orderListId: zod_1.z.number().optional(),
    clientOrderId: zod_1.z.string().optional(),
    price: zod_1.z.string(),
    origQty: zod_1.z.string(),
    executedQty: zod_1.z.string().optional(),
    cummulativeQuoteQty: zod_1.z.string().optional(),
    status: zod_1.z.string(),
    timeInForce: zod_1.z.string().optional(),
    type: zod_1.z.string(),
    side: zod_1.z.string(),
    stopPrice: zod_1.z.string().optional(),
    icebergQty: zod_1.z.string().optional(),
    time: zod_1.z.number(),
    updateTime: zod_1.z.number().optional(),
    isWorking: zod_1.z.boolean().optional(),
    origQuoteOrderQty: zod_1.z.string().optional(),
});
const openLimitOrderSchema = openMarketOrderSchema;
const allOrderSchema = openMarketOrderSchema;
const transferSchema = zod_1.z.object({
    id: zod_1.z.number().optional(),
    asset: zod_1.z.string(),
    amount: zod_1.z.string(),
    type: zod_1.z.string(),
    status: zod_1.z.string(),
    tranId: zod_1.z.number().optional(),
    timestamp: zod_1.z.number(),
    address: zod_1.z.string().optional(),
    addressTag: zod_1.z.string().optional(),
    txId: zod_1.z.string().optional(),
});
const fiatDepositSchema = zod_1.z.object({
    orderNo: zod_1.z.string().optional(),
    fiatCurrency: zod_1.z.string().optional(),
    indicatedAmount: zod_1.z.string(),
    amount: zod_1.z.string(),
    totalFee: zod_1.z.string().optional(),
    method: zod_1.z.string().optional(),
    status: zod_1.z.string(),
    createTime: zod_1.z.number().optional(),
    updateTime: zod_1.z.number().optional(),
});
const fiatWithdrawalSchema = zod_1.z.object({
    orderNo: zod_1.z.string().optional(),
    fiatCurrency: zod_1.z.string().optional(),
    indicatedAmount: zod_1.z.string(),
    amount: zod_1.z.string(),
    totalFee: zod_1.z.string().optional(),
    method: zod_1.z.string().optional(),
    status: zod_1.z.string(),
    createTime: zod_1.z.number().optional(),
    updateTime: zod_1.z.number().optional(),
});
const affiliatePaymentSchema = zod_1.z.object({
    amount: zod_1.z.string(),
    asset: zod_1.z.string().optional(),
    time: zod_1.z.number().optional(),
    month: zod_1.z.string().optional(),
});
const referralPaymentSchema = zod_1.z.object({
    userId: zod_1.z.string().optional(),
    registerTime: zod_1.z.number().optional(),
    amount: zod_1.z.string(),
    asset: zod_1.z.string(),
    time: zod_1.z.number(),
});
const symbolSchema = zod_1.z.object({
    symbol: zod_1.z.string(),
    status: zod_1.z.string().optional(),
    baseAsset: zod_1.z.string().optional(),
    baseAssetPrecision: zod_1.z.number().optional(),
    quoteAsset: zod_1.z.string().optional(),
    quotePrecision: zod_1.z.number().optional(),
    quoteAssetPrecision: zod_1.z.number().optional(),
    orderTypes: zod_1.z.array(zod_1.z.string()).optional(),
    icebergAllowed: zod_1.z.boolean().optional(),
    ocoAllowed: zod_1.z.boolean().optional(),
    isSpotTradingAllowed: zod_1.z.boolean().optional(),
    isMarginTradingAllowed: zod_1.z.boolean().optional(),
});
const latestPriceChartSchema = zod_1.z.object({
    symbol: zod_1.z.string(),
    price: zod_1.z.string(),
    time: zod_1.z.number().optional(),
});
exports.schemas = {
    ticker24hr: zod_1.z.array(ticker24hrSymbolSchema),
    ticker24hrSymbol: ticker24hrSymbolSchema,
    avgPrice: avgPriceSchema,
    depth: depthSchema,
    trades: zod_1.z.array(tradeSchema),
    aggTrades: zod_1.z.array(aggTradeSchema),
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
    marketTradesWithFees: zod_1.z.array(marketTradeWithFeesSchema),
    accountBalances: accountBalancesSchema,
    assetBalance: assetBalanceSchema,
    openMarketOrders: zod_1.z.array(openMarketOrderSchema),
    openLimitOrders: zod_1.z.array(openLimitOrderSchema),
    allOrders: zod_1.z.array(allOrderSchema),
    allMarketOrders: zod_1.z.array(allOrderSchema),
    transferHistory: zod_1.z.array(transferSchema),
    fiatDepositHistory: zod_1.z.array(fiatDepositSchema),
    fiatWithdrawalHistory: zod_1.z.array(fiatWithdrawalSchema),
    affiliatePayments: zod_1.z.array(affiliatePaymentSchema),
    referralPayments: zod_1.z.array(referralPaymentSchema),
    symbolsChart: zod_1.z.array(symbolSchema),
    latestPriceChart: latestPriceChartSchema,
};
