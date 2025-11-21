import { z } from 'zod';

const statusBaseSchema = z.object({
    status: z.string(),
});

const statusMessageSchema = statusBaseSchema.extend({
    message: z.string().optional(),
});

const pricePointSchema = z.object({
    bid: z.number(),
    ask: z.number(),
    last: z.number(),
});

const orderBookEntrySchema = z.object({
    amount: z.number(),
    rate: z.number(),
    total: z.number(),
    coin: z.string(),
    market: z.string().optional(),
});

const completedOrderSchema = orderBookEntrySchema.extend({
    solddate: z.string().optional(),
});

const completedOrderWithFeesSchema = completedOrderSchema.extend({
    audfeeExGst: z.number().optional(),
    audGst: z.number().optional(),
    audtotal: z.number().optional(),
    type: z.string().optional(),
    otc: z.boolean().optional(),
});

const placedOrderSchema = statusMessageSchema.extend({
    coin: z.string(),
    market: z.string(),
    amount: z.number(),
    rate: z.number(),
    id: z.string(),
});

const editOrderSchema = statusMessageSchema.extend({
    id: z.string(),
    coin: z.string(),
    rate: z.number(),
    newrate: z.number(),
    amount: z.number(),
    total: z.number(),
    updated: z.boolean(),
});

const executionSchema = statusMessageSchema.extend({
    coin: z.string(),
    amount: z.number(),
    market: z.string(),
    total: z.number(),
    rate: z.number().optional(),
});

const balanceEntrySchema = z.object({
    balance: z.number(),
    available: z.number().optional(),
    audbalance: z.number(),
    rate: z.number(),
});

const marketOrderHistorySchema = statusMessageSchema.extend({
    buyorders: z.array(completedOrderWithFeesSchema),
    sellorders: z.array(completedOrderWithFeesSchema),
});

export const schemas = {
    status: statusBaseSchema,
    statusMessage: statusMessageSchema,
    latestPrices: statusMessageSchema.extend({
        prices: z.record(pricePointSchema),
    }),
    latestCoinPrices: statusMessageSchema.extend({
        prices: pricePointSchema,
    }),
    latestRate: statusMessageSchema.extend({
        rate: z.number(),
        market: z.string(),
    }),
    orderBook: statusMessageSchema.extend({
        buyorders: z.array(orderBookEntrySchema),
        sellorders: z.array(orderBookEntrySchema),
    }),
    completedOrders: statusMessageSchema.extend({
        buyorders: z.array(completedOrderSchema),
        sellorders: z.array(completedOrderSchema),
    }),
    completedOrdersSummary: statusMessageSchema.extend({
        orders: z.array(completedOrderSchema),
    }),
    depositAddresses: statusMessageSchema.extend({
        networks: z.array(
            z.object({
                name: z.string(),
                network: z.string(),
                address: z.string(),
                memo: z.string().optional(),
            })
        ),
    }),
    quote: statusMessageSchema.extend({
        rate: z.number(),
    }),
    placedOrder: placedOrderSchema,
    editedBuyOrder: editOrderSchema,
    editedSellOrder: editOrderSchema,
    buyNowExecution: executionSchema,
    sellNowExecution: executionSchema,
    swapNowExecution: executionSchema,
    cancel: statusMessageSchema,
    withdrawalDetails: statusMessageSchema.extend({
        networks: z.array(
            z.object({
                network: z.string(),
                paymentid: z.string().optional(),
                fee: z.number().optional(),
                minsend: z.number().optional(),
                default: z.boolean().optional(),
            })
        ),
    }),
    sendCoins: statusMessageSchema,
    roMarketOrders: statusMessageSchema.extend({
        buyorders: z.array(orderBookEntrySchema),
        sellorders: z.array(orderBookEntrySchema),
    }),
    roMarketOrdersWithFees: marketOrderHistorySchema,
    roBalances: statusMessageSchema.extend({
        balances: z.array(z.record(balanceEntrySchema)),
    }),
    roBalanceForCoin: statusMessageSchema.extend({
        balance: z.record(balanceEntrySchema),
    }),
    roMyOpenMarketOrders: statusMessageSchema.extend({
        buyorders: z.array(
            z.object({
                id: z.string(),
                coin: z.string(),
                market: z.string(),
                amount: z.number(),
                created: z.string(),
                rate: z.number(),
                total: z.number(),
            })
        ),
        sellorders: z.array(
            z.object({
                id: z.string(),
                coin: z.string(),
                market: z.string(),
                amount: z.number(),
                created: z.string(),
                rate: z.number(),
                total: z.number(),
            })
        ),
    }),
    roMyOpenLimitOrders: statusMessageSchema.extend({
        buyorders: z.array(
            z.object({
                id: z.string(),
                coin: z.string(),
                market: z.string(),
                rate: z.number(),
                amount: z.number(),
                created: z.string(),
                type: z.string(),
            })
        ),
        sellorders: z.array(
            z.object({
                id: z.string(),
                coin: z.string(),
                market: z.string(),
                rate: z.number(),
                amount: z.number(),
                created: z.string(),
                type: z.string(),
            })
        ),
    }),
    roMyOrdersHistory: marketOrderHistorySchema,
    roMyMarketOrdersHistory: marketOrderHistorySchema,
    roSendReceive: statusMessageSchema.extend({
        sendtransactions: z.array(
            z.object({
                timestamp: z.string(),
                amount: z.number(),
                coin: z.string(),
                address: z.string(),
                aud: z.number().optional(),
                sendfee: z.number().optional(),
            })
        ),
        receivetransactions: z.array(
            z.object({
                timestamp: z.string(),
                amount: z.number(),
                coin: z.string(),
                address: z.string(),
                aud: z.number().optional(),
                from: z.string().optional(),
            })
        ),
    }),
    roDeposits: statusMessageSchema.extend({
        deposits: z.array(
            z.object({
                amount: z.number(),
                created: z.string(),
                status: z.string(),
                type: z.string(),
                reference: z.string(),
            })
        ),
    }),
    roWithdrawals: statusMessageSchema.extend({
        withdrawals: z.array(
            z.object({
                amount: z.number(),
                created: z.string(),
                status: z.string(),
            })
        ),
    }),
    roAffiliatePayments: statusMessageSchema.extend({
        payments: z.array(
            z.object({
                amount: z.number(),
                month: z.string(),
            })
        ),
    }),
    roReferralPayments: statusMessageSchema.extend({
        payments: z.array(
            z.object({
                amount: z.number(),
                coin: z.string(),
                audamount: z.number(),
                timestamp: z.string(),
            })
        ),
    }),
};

export type StatusResponse = z.infer<typeof schemas.status>;
export type StatusMessageResponse = z.infer<typeof schemas.statusMessage>;
export type LatestPricesResponse = z.infer<typeof schemas.latestPrices>;
export type LatestCoinPricesResponse = z.infer<typeof schemas.latestCoinPrices>;
export type LatestRateResponse = z.infer<typeof schemas.latestRate>;
export type OrderBookResponse = z.infer<typeof schemas.orderBook>;
export type CompletedOrdersResponse = z.infer<typeof schemas.completedOrders>;
export type CompletedOrdersSummaryResponse = z.infer<typeof schemas.completedOrdersSummary>;
export type DepositAddressesResponse = z.infer<typeof schemas.depositAddresses>;
export type QuoteResponse = z.infer<typeof schemas.quote>;
export type PlacedOrderResponse = z.infer<typeof schemas.placedOrder>;
export type EditOrderResponse = z.infer<typeof schemas.editedBuyOrder>;
export type ExecutionResponse = z.infer<typeof schemas.buyNowExecution>;
export type CancellationResponse = z.infer<typeof schemas.cancel>;
export type WithdrawalDetailsResponse = z.infer<typeof schemas.withdrawalDetails>;
export type SendCoinResponse = z.infer<typeof schemas.sendCoins>;
export type ReadOnlyMarketOrdersResponse = z.infer<typeof schemas.roMarketOrders>;
export type ReadOnlyMarketOrdersWithFeesResponse = z.infer<typeof schemas.roMarketOrdersWithFees>;
export type ReadOnlyBalancesResponse = z.infer<typeof schemas.roBalances>;
export type ReadOnlyBalanceResponse = z.infer<typeof schemas.roBalanceForCoin>;
export type ReadOnlyMyOpenMarketOrdersResponse = z.infer<typeof schemas.roMyOpenMarketOrders>;
export type ReadOnlyMyOpenLimitOrdersResponse = z.infer<typeof schemas.roMyOpenLimitOrders>;
export type ReadOnlyMyOrdersHistoryResponse = z.infer<typeof schemas.roMyOrdersHistory>;
export type ReadOnlyMyMarketOrdersHistoryResponse = z.infer<typeof schemas.roMyMarketOrdersHistory>;
export type ReadOnlySendReceiveResponse = z.infer<typeof schemas.roSendReceive>;
export type ReadOnlyDepositsResponse = z.infer<typeof schemas.roDeposits>;
export type ReadOnlyWithdrawalsResponse = z.infer<typeof schemas.roWithdrawals>;
export type ReadOnlyAffiliatePaymentsResponse = z.infer<typeof schemas.roAffiliatePayments>;
export type ReadOnlyReferralPaymentsResponse = z.infer<typeof schemas.roReferralPayments>;
