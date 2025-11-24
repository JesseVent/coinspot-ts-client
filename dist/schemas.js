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
const coerceNumber = (schema) => zod_1.z.preprocess((val) => {
    if (val === "NaN")
        return null;
    if (typeof val === "string") {
        const n = Number(val);
        return Number.isNaN(n) ? val : n;
    }
    return val;
}, schema);
const num = coerceNumber(zod_1.z.number());
const numNullable = coerceNumber(zod_1.z.number().nullable());
const pricePointSchema = zod_1.z.object({
    bid: numNullable,
    ask: numNullable,
    last: numNullable.optional(),
});
const orderBookEntrySchema = zod_1.z.object({
    amount: num,
    rate: num,
    total: num,
    coin: zod_1.z.string(),
    market: zod_1.z.string().optional(),
});
const completedOrderSchema = orderBookEntrySchema.extend({
    solddate: zod_1.z.string().optional(),
});
const completedOrderWithFeesSchema = completedOrderSchema.extend({
    audfeeExGst: numNullable.optional(),
    audGst: numNullable.optional(),
    audtotal: numNullable.optional(),
    type: zod_1.z.string().optional(),
    otc: zod_1.z.boolean().optional(),
});
const placedOrderSchema = statusMessageSchema.extend({
    coin: zod_1.z.string(),
    market: zod_1.z.string(),
    amount: num,
    rate: num,
    id: zod_1.z.string(),
});
const editOrderSchema = statusMessageSchema.extend({
    id: zod_1.z.string(),
    coin: zod_1.z.string(),
    rate: num,
    newrate: num,
    amount: num,
    total: num,
    updated: zod_1.z.boolean(),
});
const executionSchema = statusMessageSchema.extend({
    coin: zod_1.z.string(),
    amount: num,
    market: zod_1.z.string(),
    total: num,
    rate: numNullable.optional(),
});
const balanceEntrySchema = zod_1.z.object({
    balance: num,
    available: numNullable.optional(),
    audbalance: num,
    rate: num,
});
const marketOrderHistorySchema = statusMessageSchema.extend({
    buyorders: zod_1.z.array(completedOrderWithFeesSchema),
    sellorders: zod_1.z.array(completedOrderWithFeesSchema),
});
exports.schemas = {
    account: statusBaseSchema,
    statusMessage: statusMessageSchema,
    ticker24hr: statusMessageSchema.extend({
        prices: zod_1.z.record(pricePointSchema),
    }),
    ticker24hrSymbol: statusMessageSchema.extend({
        prices: pricePointSchema,
    }),
    avgPrice: statusMessageSchema.extend({
        rate: numNullable,
        market: zod_1.z.string(),
    }),
    depth: statusMessageSchema.extend({
        buyorders: zod_1.z.array(orderBookEntrySchema),
        sellorders: zod_1.z.array(orderBookEntrySchema),
    }),
    trades: statusMessageSchema.extend({
        buyorders: zod_1.z.array(completedOrderSchema),
        sellorders: zod_1.z.array(completedOrderSchema),
    }),
    aggTrades: statusMessageSchema.extend({
        orders: zod_1.z.array(completedOrderSchema),
    }),
    capitalDepositAddress: statusMessageSchema.extend({
        networks: zod_1.z.array(zod_1.z.object({
            name: zod_1.z.string(),
            network: zod_1.z.string(),
            address: zod_1.z.string(),
            memo: zod_1.z.string().optional(),
        })),
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
        networks: zod_1.z.array(zod_1.z.object({
            network: zod_1.z.string(),
            paymentid: zod_1.z.string().optional(),
            fee: numNullable.optional(),
            minsend: numNullable.optional(),
            default: zod_1.z.boolean().optional(),
        })),
    }),
    withdraw: statusMessageSchema,
    marketDepth: statusMessageSchema.extend({
        buyorders: zod_1.z.array(orderBookEntrySchema),
        sellorders: zod_1.z.array(orderBookEntrySchema),
    }),
    marketTradesWithFees: marketOrderHistorySchema,
    accountBalances: statusMessageSchema.extend({
        balances: zod_1.z.array(zod_1.z.record(balanceEntrySchema)),
    }),
    assetBalance: statusMessageSchema.extend({
        balance: zod_1.z.record(balanceEntrySchema),
    }),
    openMarketOrders: statusMessageSchema.extend({
        buyorders: zod_1.z.array(zod_1.z.object({
            id: zod_1.z.string(),
            coin: zod_1.z.string(),
            market: zod_1.z.string(),
            amount: num,
            created: zod_1.z.string(),
            rate: num,
            total: num,
        })),
        sellorders: zod_1.z.array(zod_1.z.object({
            id: zod_1.z.string(),
            coin: zod_1.z.string(),
            market: zod_1.z.string(),
            amount: num,
            created: zod_1.z.string(),
            rate: num,
            total: num,
        })),
    }),
    openLimitOrders: statusMessageSchema.extend({
        buyorders: zod_1.z.array(zod_1.z.object({
            id: zod_1.z.string(),
            coin: zod_1.z.string(),
            market: zod_1.z.string(),
            rate: num,
            amount: num,
            created: zod_1.z.string(),
            type: zod_1.z.string(),
        })),
        sellorders: zod_1.z.array(zod_1.z.object({
            id: zod_1.z.string(),
            coin: zod_1.z.string(),
            market: zod_1.z.string(),
            rate: num,
            amount: num,
            created: zod_1.z.string(),
            type: zod_1.z.string(),
        })),
    }),
    allOrders: marketOrderHistorySchema,
    allMarketOrders: marketOrderHistorySchema,
    transferHistory: statusMessageSchema.extend({
        sendtransactions: zod_1.z.array(zod_1.z.object({
            timestamp: zod_1.z.string(),
            amount: num,
            coin: zod_1.z.string(),
            address: zod_1.z.string(),
            aud: numNullable.optional(),
            sendfee: numNullable.optional(),
        })),
        receivetransactions: zod_1.z.array(zod_1.z.object({
            timestamp: zod_1.z.string(),
            amount: num,
            coin: zod_1.z.string(),
            address: zod_1.z.string(),
            aud: numNullable.optional(),
            from: zod_1.z.string().optional(),
        })),
    }),
    fiatDepositHistory: statusMessageSchema.extend({
        deposits: zod_1.z.array(zod_1.z.object({
            amount: num,
            created: zod_1.z.string(),
            status: zod_1.z.string(),
            type: zod_1.z.string(),
            reference: zod_1.z.string(),
        })),
    }),
    fiatWithdrawalHistory: statusMessageSchema.extend({
        withdrawals: zod_1.z.array(zod_1.z.object({
            amount: num,
            created: zod_1.z.string(),
            status: zod_1.z.string(),
        })),
    }),
    affiliatePayments: statusMessageSchema.extend({
        payments: zod_1.z.array(zod_1.z.object({
            amount: num,
            month: zod_1.z.string(),
        })),
    }),
    referralPayments: statusMessageSchema.extend({
        payments: zod_1.z.array(zod_1.z.object({
            amount: num,
            coin: zod_1.z.string(),
            audamount: num,
            timestamp: zod_1.z.string(),
        })),
    }),
};
