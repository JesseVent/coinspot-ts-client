"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemas = void 0;
const zod_1 = require("zod");
const statusBaseSchema = zod_1.z.object({
    status: zod_1.z.string(),
});
const statusMessageSchema = statusBaseSchema.extend({
    message: zod_1.z.string().optional(),
});
const pricePointSchema = zod_1.z.object({
    bid: zod_1.z.number(),
    ask: zod_1.z.number(),
    last: zod_1.z.number(),
});
const orderBookEntrySchema = zod_1.z.object({
    amount: zod_1.z.number(),
    rate: zod_1.z.number(),
    total: zod_1.z.number(),
    coin: zod_1.z.string(),
    market: zod_1.z.string().optional(),
});
const completedOrderSchema = orderBookEntrySchema.extend({
    solddate: zod_1.z.string().optional(),
});
const completedOrderWithFeesSchema = completedOrderSchema.extend({
    audfeeExGst: zod_1.z.number().optional(),
    audGst: zod_1.z.number().optional(),
    audtotal: zod_1.z.number().optional(),
    type: zod_1.z.string().optional(),
    otc: zod_1.z.boolean().optional(),
});
const placedOrderSchema = statusMessageSchema.extend({
    coin: zod_1.z.string(),
    market: zod_1.z.string(),
    amount: zod_1.z.number(),
    rate: zod_1.z.number(),
    id: zod_1.z.string(),
});
const editOrderSchema = statusMessageSchema.extend({
    id: zod_1.z.string(),
    coin: zod_1.z.string(),
    rate: zod_1.z.number(),
    newrate: zod_1.z.number(),
    amount: zod_1.z.number(),
    total: zod_1.z.number(),
    updated: zod_1.z.boolean(),
});
const executionSchema = statusMessageSchema.extend({
    coin: zod_1.z.string(),
    amount: zod_1.z.number(),
    market: zod_1.z.string(),
    total: zod_1.z.number(),
    rate: zod_1.z.number().optional(),
});
const balanceEntrySchema = zod_1.z.object({
    balance: zod_1.z.number(),
    available: zod_1.z.number().optional(),
    audbalance: zod_1.z.number(),
    rate: zod_1.z.number(),
});
const marketOrderHistorySchema = statusMessageSchema.extend({
    buyorders: zod_1.z.array(completedOrderWithFeesSchema),
    sellorders: zod_1.z.array(completedOrderWithFeesSchema),
});
exports.schemas = {
    status: statusBaseSchema,
    statusMessage: statusMessageSchema,
    latestPrices: statusMessageSchema.extend({
        prices: zod_1.z.record(pricePointSchema),
    }),
    latestCoinPrices: statusMessageSchema.extend({
        prices: pricePointSchema,
    }),
    latestRate: statusMessageSchema.extend({
        rate: zod_1.z.number(),
        market: zod_1.z.string(),
    }),
    orderBook: statusMessageSchema.extend({
        buyorders: zod_1.z.array(orderBookEntrySchema),
        sellorders: zod_1.z.array(orderBookEntrySchema),
    }),
    completedOrders: statusMessageSchema.extend({
        buyorders: zod_1.z.array(completedOrderSchema),
        sellorders: zod_1.z.array(completedOrderSchema),
    }),
    completedOrdersSummary: statusMessageSchema.extend({
        orders: zod_1.z.array(completedOrderSchema),
    }),
    depositAddresses: statusMessageSchema.extend({
        networks: zod_1.z.array(zod_1.z.object({
            name: zod_1.z.string(),
            network: zod_1.z.string(),
            address: zod_1.z.string(),
            memo: zod_1.z.string().optional(),
        })),
    }),
    quote: statusMessageSchema.extend({
        rate: zod_1.z.number(),
    }),
    placedOrder: placedOrderSchema,
    editedBuyOrder: editOrderSchema,
    editedSellOrder: editOrderSchema,
    buyNowExecution: executionSchema,
    sellNowExecution: executionSchema,
    swapNowExecution: executionSchema,
    cancel: statusMessageSchema,
    withdrawalDetails: statusMessageSchema.extend({
        networks: zod_1.z.array(zod_1.z.object({
            network: zod_1.z.string(),
            paymentid: zod_1.z.string().optional(),
            fee: zod_1.z.number().optional(),
            minsend: zod_1.z.number().optional(),
            default: zod_1.z.boolean().optional(),
        })),
    }),
    sendCoins: statusMessageSchema,
    roMarketOrders: statusMessageSchema.extend({
        buyorders: zod_1.z.array(orderBookEntrySchema),
        sellorders: zod_1.z.array(orderBookEntrySchema),
    }),
    roMarketOrdersWithFees: marketOrderHistorySchema,
    roBalances: statusMessageSchema.extend({
        balances: zod_1.z.array(zod_1.z.record(balanceEntrySchema)),
    }),
    roBalanceForCoin: statusMessageSchema.extend({
        balance: zod_1.z.record(balanceEntrySchema),
    }),
    roMyOpenMarketOrders: statusMessageSchema.extend({
        buyorders: zod_1.z.array(zod_1.z.object({
            id: zod_1.z.string(),
            coin: zod_1.z.string(),
            market: zod_1.z.string(),
            amount: zod_1.z.number(),
            created: zod_1.z.string(),
            rate: zod_1.z.number(),
            total: zod_1.z.number(),
        })),
        sellorders: zod_1.z.array(zod_1.z.object({
            id: zod_1.z.string(),
            coin: zod_1.z.string(),
            market: zod_1.z.string(),
            amount: zod_1.z.number(),
            created: zod_1.z.string(),
            rate: zod_1.z.number(),
            total: zod_1.z.number(),
        })),
    }),
    roMyOpenLimitOrders: statusMessageSchema.extend({
        buyorders: zod_1.z.array(zod_1.z.object({
            id: zod_1.z.string(),
            coin: zod_1.z.string(),
            market: zod_1.z.string(),
            rate: zod_1.z.number(),
            amount: zod_1.z.number(),
            created: zod_1.z.string(),
            type: zod_1.z.string(),
        })),
        sellorders: zod_1.z.array(zod_1.z.object({
            id: zod_1.z.string(),
            coin: zod_1.z.string(),
            market: zod_1.z.string(),
            rate: zod_1.z.number(),
            amount: zod_1.z.number(),
            created: zod_1.z.string(),
            type: zod_1.z.string(),
        })),
    }),
    roMyOrdersHistory: marketOrderHistorySchema,
    roMyMarketOrdersHistory: marketOrderHistorySchema,
    roSendReceive: statusMessageSchema.extend({
        sendtransactions: zod_1.z.array(zod_1.z.object({
            timestamp: zod_1.z.string(),
            amount: zod_1.z.number(),
            coin: zod_1.z.string(),
            address: zod_1.z.string(),
            aud: zod_1.z.number().optional(),
            sendfee: zod_1.z.number().optional(),
        })),
        receivetransactions: zod_1.z.array(zod_1.z.object({
            timestamp: zod_1.z.string(),
            amount: zod_1.z.number(),
            coin: zod_1.z.string(),
            address: zod_1.z.string(),
            aud: zod_1.z.number().optional(),
            from: zod_1.z.string().optional(),
        })),
    }),
    roDeposits: statusMessageSchema.extend({
        deposits: zod_1.z.array(zod_1.z.object({
            amount: zod_1.z.number(),
            created: zod_1.z.string(),
            status: zod_1.z.string(),
            type: zod_1.z.string(),
            reference: zod_1.z.string(),
        })),
    }),
    roWithdrawals: statusMessageSchema.extend({
        withdrawals: zod_1.z.array(zod_1.z.object({
            amount: zod_1.z.number(),
            created: zod_1.z.string(),
            status: zod_1.z.string(),
        })),
    }),
    roAffiliatePayments: statusMessageSchema.extend({
        payments: zod_1.z.array(zod_1.z.object({
            amount: zod_1.z.number(),
            month: zod_1.z.string(),
        })),
    }),
    roReferralPayments: statusMessageSchema.extend({
        payments: zod_1.z.array(zod_1.z.object({
            amount: zod_1.z.number(),
            coin: zod_1.z.string(),
            audamount: zod_1.z.number(),
            timestamp: zod_1.z.string(),
        })),
    }),
};
