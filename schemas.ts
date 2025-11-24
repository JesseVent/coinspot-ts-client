import { z } from 'zod';

const statusBaseSchema = z.object({
    status: z.string(),
});

const statusMessageSchema = statusBaseSchema.extend({
    message: z.string().optional(),
});

const coerceNumber = <T extends z.ZodTypeAny>(schema: T) =>
    z.preprocess((val) => {
        if (val === 'NaN') return null;
        if (typeof val === 'string') {
            const n = Number(val);
            return Number.isNaN(n) ? val : n;
        }
        return val;
    }, schema);

const num = coerceNumber(z.number());
const numNullable = coerceNumber(z.number().nullable());

const pricePointSchema = z.object({
    bid: numNullable,
    ask: numNullable,
    last: numNullable.optional(),
});

const orderBookEntrySchema = z.object({
    amount: num,
    rate: num,
    total: num,
    coin: z.string(),
    market: z.string().optional(),
});

const completedOrderSchema = orderBookEntrySchema.extend({
    solddate: z.string().optional(),
});

const completedOrderWithFeesSchema = completedOrderSchema.extend({
    audfeeExGst: numNullable.optional(),
    audGst: numNullable.optional(),
    audtotal: numNullable.optional(),
    type: z.string().optional(),
    otc: z.boolean().optional(),
});

const placedOrderSchema = statusMessageSchema.extend({
    coin: z.string(),
    market: z.string(),
    amount: num,
    rate: num,
    id: z.string(),
});

const editOrderSchema = statusMessageSchema.extend({
    id: z.string(),
    coin: z.string(),
    rate: num,
    newrate: num,
    amount: num,
    total: num,
    updated: z.boolean(),
});

const executionSchema = statusMessageSchema.extend({
    coin: z.string(),
    amount: num,
    market: z.string(),
    total: num,
    rate: numNullable.optional(),
});

const balanceEntrySchema = z.object({
    balance: num,
    available: numNullable.optional(),
    audbalance: num,
    rate: num,
});

const marketOrderHistorySchema = statusMessageSchema.extend({
    buyorders: z.array(completedOrderWithFeesSchema),
    sellorders: z.array(completedOrderWithFeesSchema),
});

export const schemas = {
    account: statusBaseSchema,
    statusMessage: statusMessageSchema,
    ticker24hr: statusMessageSchema.extend({
        prices: z.record(pricePointSchema),
    }),
    ticker24hrSymbol: statusMessageSchema.extend({
        prices: pricePointSchema,
    }),
    avgPrice: statusMessageSchema.extend({
        rate: numNullable,
        market: z.string(),
    }),
    depth: statusMessageSchema.extend({
        buyorders: z.array(orderBookEntrySchema),
        sellorders: z.array(orderBookEntrySchema),
    }),
    trades: statusMessageSchema.extend({
        buyorders: z.array(completedOrderSchema),
        sellorders: z.array(completedOrderSchema),
    }),
    aggTrades: statusMessageSchema.extend({
        orders: z.array(completedOrderSchema),
    }),
    capitalDepositAddress: statusMessageSchema.extend({
        networks: z.array(
            z.object({
                name: z.string(),
                network: z.string(),
                address: z.string(),
                memo: z.string().optional(),
            })
        ),
    }),
    orderQuote: statusMessageSchema.extend({
        rate: num,
    }),
    newOrder: placedOrderSchema,
    orderUpdateBuy: editOrderSchema,
    orderUpdateSell: editOrderSchema,
    marketBuyExecution: executionSchema,
    marketSellExecution: executionSchema,
    marketSwapExecution: executionSchema,
    cancelOrder: statusMessageSchema,
    withdrawDetails: statusMessageSchema.extend({
        networks: z.array(
            z.object({
                network: z.string(),
                paymentid: z.string().optional(),
                fee: numNullable.optional(),
                minsend: numNullable.optional(),
                default: z.boolean().optional(),
            })
        ),
    }),
    withdraw: statusMessageSchema,
    marketDepth: statusMessageSchema.extend({
        buyorders: z.array(orderBookEntrySchema),
        sellorders: z.array(orderBookEntrySchema),
    }),
    marketTradesWithFees: marketOrderHistorySchema,
    accountBalances: statusMessageSchema.extend({
        balances: z.array(z.record(balanceEntrySchema)),
    }),
    assetBalance: statusMessageSchema.extend({
        balance: z.record(balanceEntrySchema),
    }),
    openMarketOrders: statusMessageSchema.extend({
        buyorders: z.array(
            z.object({
                id: z.string(),
                coin: z.string(),
                market: z.string(),
                amount: num,
                created: z.string(),
                rate: num,
                total: num,
            })
        ),
        sellorders: z.array(
            z.object({
                id: z.string(),
                coin: z.string(),
                market: z.string(),
                amount: num,
                created: z.string(),
                rate: num,
                total: num,
            })
        ),
    }),
    openLimitOrders: statusMessageSchema.extend({
        buyorders: z.array(
            z.object({
                id: z.string(),
                coin: z.string(),
                market: z.string(),
                rate: num,
                amount: num,
                created: z.string(),
                type: z.string(),
            })
        ),
        sellorders: z.array(
            z.object({
                id: z.string(),
                coin: z.string(),
                market: z.string(),
                rate: num,
                amount: num,
                created: z.string(),
                type: z.string(),
            })
        ),
    }),
    allOrders: marketOrderHistorySchema,
    allMarketOrders: marketOrderHistorySchema,
    transferHistory: statusMessageSchema.extend({
        sendtransactions: z.array(
            z.object({
                timestamp: z.string(),
                amount: num,
                coin: z.string(),
                address: z.string(),
                aud: numNullable.optional(),
                sendfee: numNullable.optional(),
            })
        ),
        receivetransactions: z.array(
            z.object({
                timestamp: z.string(),
                amount: num,
                coin: z.string(),
                address: z.string(),
                aud: numNullable.optional(),
                from: z.string().optional(),
            })
        ),
    }),
    fiatDepositHistory: statusMessageSchema.extend({
        deposits: z.array(
            z.object({
                amount: num,
                created: z.string(),
                status: z.string(),
                type: z.string(),
                reference: z.string(),
            })
        ),
    }),
    fiatWithdrawalHistory: statusMessageSchema.extend({
        withdrawals: z.array(
            z.object({
                amount: num,
                created: z.string(),
                status: z.string(),
            })
        ),
    }),
    affiliatePayments: statusMessageSchema.extend({
        payments: z.array(
            z.object({
                amount: num,
                month: z.string(),
            })
        ),
    }),
    referralPayments: statusMessageSchema.extend({
        payments: z.array(
            z.object({
                amount: num,
                coin: z.string(),
                audamount: num,
                timestamp: z.string(),
            })
        ),
    }),
};

export type AccountResponse = z.infer<typeof schemas.account>;
export type StatusMessageResponse = z.infer<typeof schemas.statusMessage>;
export type Ticker24hrResponse = z.infer<typeof schemas.ticker24hr>;
export type Ticker24hrSymbolResponse = z.infer<typeof schemas.ticker24hrSymbol>;
export type AvgPriceResponse = z.infer<typeof schemas.avgPrice>;
export type DepthResponse = z.infer<typeof schemas.depth>;
export type TradesResponse = z.infer<typeof schemas.trades>;
export type AggTradesResponse = z.infer<typeof schemas.aggTrades>;
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
