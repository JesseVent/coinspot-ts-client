import { z } from "zod";
export declare const schemas: {
    account: z.ZodObject<{
        status: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        status: string;
    }, {
        status: string;
    }>;
    statusMessage: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        status: string;
        message?: string | undefined;
    }, {
        status: string;
        message?: string | undefined;
    }>;
    ticker24hr: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        prices: z.ZodRecord<z.ZodString, z.ZodObject<{
            bid: z.ZodEffects<z.ZodNullable<z.ZodNumber>, number | null, unknown>;
            ask: z.ZodEffects<z.ZodNullable<z.ZodNumber>, number | null, unknown>;
            last: z.ZodOptional<z.ZodEffects<z.ZodNullable<z.ZodNumber>, number | null, unknown>>;
        }, "strip", z.ZodTypeAny, {
            bid: number | null;
            ask: number | null;
            last?: number | null | undefined;
        }, {
            bid?: unknown;
            ask?: unknown;
            last?: unknown;
        }>>;
    }, "strip", z.ZodTypeAny, {
        status: string;
        prices: Record<string, {
            bid: number | null;
            ask: number | null;
            last?: number | null | undefined;
        }>;
        message?: string | undefined;
    }, {
        status: string;
        prices: Record<string, {
            bid?: unknown;
            ask?: unknown;
            last?: unknown;
        }>;
        message?: string | undefined;
    }>;
    ticker24hrSymbol: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        prices: z.ZodObject<{
            bid: z.ZodEffects<z.ZodNullable<z.ZodNumber>, number | null, unknown>;
            ask: z.ZodEffects<z.ZodNullable<z.ZodNumber>, number | null, unknown>;
            last: z.ZodOptional<z.ZodEffects<z.ZodNullable<z.ZodNumber>, number | null, unknown>>;
        }, "strip", z.ZodTypeAny, {
            bid: number | null;
            ask: number | null;
            last?: number | null | undefined;
        }, {
            bid?: unknown;
            ask?: unknown;
            last?: unknown;
        }>;
    }, "strip", z.ZodTypeAny, {
        status: string;
        prices: {
            bid: number | null;
            ask: number | null;
            last?: number | null | undefined;
        };
        message?: string | undefined;
    }, {
        status: string;
        prices: {
            bid?: unknown;
            ask?: unknown;
            last?: unknown;
        };
        message?: string | undefined;
    }>;
    avgPrice: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        rate: z.ZodEffects<z.ZodNullable<z.ZodNumber>, number | null, unknown>;
        market: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        status: string;
        rate: number | null;
        market: string;
        message?: string | undefined;
    }, {
        status: string;
        market: string;
        message?: string | undefined;
        rate?: unknown;
    }>;
    depth: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        buyorders: z.ZodArray<z.ZodObject<{
            amount: z.ZodEffects<z.ZodNumber, number, unknown>;
            rate: z.ZodEffects<z.ZodNumber, number, unknown>;
            total: z.ZodEffects<z.ZodNumber, number, unknown>;
            coin: z.ZodString;
            market: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            amount: number;
            rate: number;
            total: number;
            coin: string;
            market?: string | undefined;
        }, {
            coin: string;
            amount?: unknown;
            rate?: unknown;
            total?: unknown;
            market?: string | undefined;
        }>, "many">;
        sellorders: z.ZodArray<z.ZodObject<{
            amount: z.ZodEffects<z.ZodNumber, number, unknown>;
            rate: z.ZodEffects<z.ZodNumber, number, unknown>;
            total: z.ZodEffects<z.ZodNumber, number, unknown>;
            coin: z.ZodString;
            market: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            amount: number;
            rate: number;
            total: number;
            coin: string;
            market?: string | undefined;
        }, {
            coin: string;
            amount?: unknown;
            rate?: unknown;
            total?: unknown;
            market?: string | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        status: string;
        buyorders: {
            amount: number;
            rate: number;
            total: number;
            coin: string;
            market?: string | undefined;
        }[];
        sellorders: {
            amount: number;
            rate: number;
            total: number;
            coin: string;
            market?: string | undefined;
        }[];
        message?: string | undefined;
    }, {
        status: string;
        buyorders: {
            coin: string;
            amount?: unknown;
            rate?: unknown;
            total?: unknown;
            market?: string | undefined;
        }[];
        sellorders: {
            coin: string;
            amount?: unknown;
            rate?: unknown;
            total?: unknown;
            market?: string | undefined;
        }[];
        message?: string | undefined;
    }>;
    trades: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        buyorders: z.ZodArray<z.ZodObject<{
            amount: z.ZodEffects<z.ZodNumber, number, unknown>;
            rate: z.ZodEffects<z.ZodNumber, number, unknown>;
            total: z.ZodEffects<z.ZodNumber, number, unknown>;
            coin: z.ZodString;
            market: z.ZodOptional<z.ZodString>;
        } & {
            solddate: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            amount: number;
            rate: number;
            total: number;
            coin: string;
            market?: string | undefined;
            solddate?: string | undefined;
        }, {
            coin: string;
            amount?: unknown;
            rate?: unknown;
            total?: unknown;
            market?: string | undefined;
            solddate?: string | undefined;
        }>, "many">;
        sellorders: z.ZodArray<z.ZodObject<{
            amount: z.ZodEffects<z.ZodNumber, number, unknown>;
            rate: z.ZodEffects<z.ZodNumber, number, unknown>;
            total: z.ZodEffects<z.ZodNumber, number, unknown>;
            coin: z.ZodString;
            market: z.ZodOptional<z.ZodString>;
        } & {
            solddate: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            amount: number;
            rate: number;
            total: number;
            coin: string;
            market?: string | undefined;
            solddate?: string | undefined;
        }, {
            coin: string;
            amount?: unknown;
            rate?: unknown;
            total?: unknown;
            market?: string | undefined;
            solddate?: string | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        status: string;
        buyorders: {
            amount: number;
            rate: number;
            total: number;
            coin: string;
            market?: string | undefined;
            solddate?: string | undefined;
        }[];
        sellorders: {
            amount: number;
            rate: number;
            total: number;
            coin: string;
            market?: string | undefined;
            solddate?: string | undefined;
        }[];
        message?: string | undefined;
    }, {
        status: string;
        buyorders: {
            coin: string;
            amount?: unknown;
            rate?: unknown;
            total?: unknown;
            market?: string | undefined;
            solddate?: string | undefined;
        }[];
        sellorders: {
            coin: string;
            amount?: unknown;
            rate?: unknown;
            total?: unknown;
            market?: string | undefined;
            solddate?: string | undefined;
        }[];
        message?: string | undefined;
    }>;
    aggTrades: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        orders: z.ZodArray<z.ZodObject<{
            amount: z.ZodEffects<z.ZodNumber, number, unknown>;
            rate: z.ZodEffects<z.ZodNumber, number, unknown>;
            total: z.ZodEffects<z.ZodNumber, number, unknown>;
            coin: z.ZodString;
            market: z.ZodOptional<z.ZodString>;
        } & {
            solddate: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            amount: number;
            rate: number;
            total: number;
            coin: string;
            market?: string | undefined;
            solddate?: string | undefined;
        }, {
            coin: string;
            amount?: unknown;
            rate?: unknown;
            total?: unknown;
            market?: string | undefined;
            solddate?: string | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        status: string;
        orders: {
            amount: number;
            rate: number;
            total: number;
            coin: string;
            market?: string | undefined;
            solddate?: string | undefined;
        }[];
        message?: string | undefined;
    }, {
        status: string;
        orders: {
            coin: string;
            amount?: unknown;
            rate?: unknown;
            total?: unknown;
            market?: string | undefined;
            solddate?: string | undefined;
        }[];
        message?: string | undefined;
    }>;
    capitalDepositAddress: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        networks: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            network: z.ZodString;
            address: z.ZodString;
            memo: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            network: string;
            address: string;
            memo?: string | undefined;
        }, {
            name: string;
            network: string;
            address: string;
            memo?: string | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        status: string;
        networks: {
            name: string;
            network: string;
            address: string;
            memo?: string | undefined;
        }[];
        message?: string | undefined;
    }, {
        status: string;
        networks: {
            name: string;
            network: string;
            address: string;
            memo?: string | undefined;
        }[];
        message?: string | undefined;
    }>;
    orderQuote: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        rate: z.ZodEffects<z.ZodNumber, number, unknown>;
    }, "strip", z.ZodTypeAny, {
        status: string;
        rate: number;
        message?: string | undefined;
    }, {
        status: string;
        message?: string | undefined;
        rate?: unknown;
    }>;
    newOrder: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        coin: z.ZodString;
        market: z.ZodString;
        amount: z.ZodEffects<z.ZodNumber, number, unknown>;
        rate: z.ZodEffects<z.ZodNumber, number, unknown>;
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        status: string;
        amount: number;
        rate: number;
        coin: string;
        market: string;
        id: string;
        message?: string | undefined;
    }, {
        status: string;
        coin: string;
        market: string;
        id: string;
        message?: string | undefined;
        amount?: unknown;
        rate?: unknown;
    }>;
    orderUpdateBuy: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        id: z.ZodString;
        coin: z.ZodString;
        rate: z.ZodEffects<z.ZodNumber, number, unknown>;
        newrate: z.ZodEffects<z.ZodNumber, number, unknown>;
        amount: z.ZodEffects<z.ZodNumber, number, unknown>;
        total: z.ZodEffects<z.ZodNumber, number, unknown>;
        updated: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        status: string;
        amount: number;
        rate: number;
        total: number;
        coin: string;
        id: string;
        newrate: number;
        updated: boolean;
        message?: string | undefined;
    }, {
        status: string;
        coin: string;
        id: string;
        updated: boolean;
        message?: string | undefined;
        amount?: unknown;
        rate?: unknown;
        total?: unknown;
        newrate?: unknown;
    }>;
    orderUpdateSell: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        id: z.ZodString;
        coin: z.ZodString;
        rate: z.ZodEffects<z.ZodNumber, number, unknown>;
        newrate: z.ZodEffects<z.ZodNumber, number, unknown>;
        amount: z.ZodEffects<z.ZodNumber, number, unknown>;
        total: z.ZodEffects<z.ZodNumber, number, unknown>;
        updated: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        status: string;
        amount: number;
        rate: number;
        total: number;
        coin: string;
        id: string;
        newrate: number;
        updated: boolean;
        message?: string | undefined;
    }, {
        status: string;
        coin: string;
        id: string;
        updated: boolean;
        message?: string | undefined;
        amount?: unknown;
        rate?: unknown;
        total?: unknown;
        newrate?: unknown;
    }>;
    marketBuyExecution: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        coin: z.ZodString;
        amount: z.ZodEffects<z.ZodNumber, number, unknown>;
        market: z.ZodString;
        total: z.ZodEffects<z.ZodNumber, number, unknown>;
        rate: z.ZodOptional<z.ZodEffects<z.ZodNullable<z.ZodNumber>, number | null, unknown>>;
    }, "strip", z.ZodTypeAny, {
        status: string;
        amount: number;
        total: number;
        coin: string;
        market: string;
        message?: string | undefined;
        rate?: number | null | undefined;
    }, {
        status: string;
        coin: string;
        market: string;
        message?: string | undefined;
        amount?: unknown;
        rate?: unknown;
        total?: unknown;
    }>;
    marketSellExecution: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        coin: z.ZodString;
        amount: z.ZodEffects<z.ZodNumber, number, unknown>;
        market: z.ZodString;
        total: z.ZodEffects<z.ZodNumber, number, unknown>;
        rate: z.ZodOptional<z.ZodEffects<z.ZodNullable<z.ZodNumber>, number | null, unknown>>;
    }, "strip", z.ZodTypeAny, {
        status: string;
        amount: number;
        total: number;
        coin: string;
        market: string;
        message?: string | undefined;
        rate?: number | null | undefined;
    }, {
        status: string;
        coin: string;
        market: string;
        message?: string | undefined;
        amount?: unknown;
        rate?: unknown;
        total?: unknown;
    }>;
    marketSwapExecution: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        coin: z.ZodString;
        amount: z.ZodEffects<z.ZodNumber, number, unknown>;
        market: z.ZodString;
        total: z.ZodEffects<z.ZodNumber, number, unknown>;
        rate: z.ZodOptional<z.ZodEffects<z.ZodNullable<z.ZodNumber>, number | null, unknown>>;
    }, "strip", z.ZodTypeAny, {
        status: string;
        amount: number;
        total: number;
        coin: string;
        market: string;
        message?: string | undefined;
        rate?: number | null | undefined;
    }, {
        status: string;
        coin: string;
        market: string;
        message?: string | undefined;
        amount?: unknown;
        rate?: unknown;
        total?: unknown;
    }>;
    cancelOrder: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        status: string;
        message?: string | undefined;
    }, {
        status: string;
        message?: string | undefined;
    }>;
    withdrawDetails: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        networks: z.ZodArray<z.ZodObject<{
            network: z.ZodString;
            paymentid: z.ZodOptional<z.ZodString>;
            fee: z.ZodOptional<z.ZodEffects<z.ZodNullable<z.ZodNumber>, number | null, unknown>>;
            minsend: z.ZodOptional<z.ZodEffects<z.ZodNullable<z.ZodNumber>, number | null, unknown>>;
            default: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            network: string;
            paymentid?: string | undefined;
            fee?: number | null | undefined;
            minsend?: number | null | undefined;
            default?: boolean | undefined;
        }, {
            network: string;
            paymentid?: string | undefined;
            fee?: unknown;
            minsend?: unknown;
            default?: boolean | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        status: string;
        networks: {
            network: string;
            paymentid?: string | undefined;
            fee?: number | null | undefined;
            minsend?: number | null | undefined;
            default?: boolean | undefined;
        }[];
        message?: string | undefined;
    }, {
        status: string;
        networks: {
            network: string;
            paymentid?: string | undefined;
            fee?: unknown;
            minsend?: unknown;
            default?: boolean | undefined;
        }[];
        message?: string | undefined;
    }>;
    withdraw: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        status: string;
        message?: string | undefined;
    }, {
        status: string;
        message?: string | undefined;
    }>;
    marketDepth: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        buyorders: z.ZodArray<z.ZodObject<{
            amount: z.ZodEffects<z.ZodNumber, number, unknown>;
            rate: z.ZodEffects<z.ZodNumber, number, unknown>;
            total: z.ZodEffects<z.ZodNumber, number, unknown>;
            coin: z.ZodString;
            market: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            amount: number;
            rate: number;
            total: number;
            coin: string;
            market?: string | undefined;
        }, {
            coin: string;
            amount?: unknown;
            rate?: unknown;
            total?: unknown;
            market?: string | undefined;
        }>, "many">;
        sellorders: z.ZodArray<z.ZodObject<{
            amount: z.ZodEffects<z.ZodNumber, number, unknown>;
            rate: z.ZodEffects<z.ZodNumber, number, unknown>;
            total: z.ZodEffects<z.ZodNumber, number, unknown>;
            coin: z.ZodString;
            market: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            amount: number;
            rate: number;
            total: number;
            coin: string;
            market?: string | undefined;
        }, {
            coin: string;
            amount?: unknown;
            rate?: unknown;
            total?: unknown;
            market?: string | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        status: string;
        buyorders: {
            amount: number;
            rate: number;
            total: number;
            coin: string;
            market?: string | undefined;
        }[];
        sellorders: {
            amount: number;
            rate: number;
            total: number;
            coin: string;
            market?: string | undefined;
        }[];
        message?: string | undefined;
    }, {
        status: string;
        buyorders: {
            coin: string;
            amount?: unknown;
            rate?: unknown;
            total?: unknown;
            market?: string | undefined;
        }[];
        sellorders: {
            coin: string;
            amount?: unknown;
            rate?: unknown;
            total?: unknown;
            market?: string | undefined;
        }[];
        message?: string | undefined;
    }>;
    marketTradesWithFees: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        buyorders: z.ZodArray<z.ZodObject<{
            amount: z.ZodEffects<z.ZodNumber, number, unknown>;
            rate: z.ZodEffects<z.ZodNumber, number, unknown>;
            total: z.ZodEffects<z.ZodNumber, number, unknown>;
            coin: z.ZodString;
            market: z.ZodOptional<z.ZodString>;
        } & {
            solddate: z.ZodOptional<z.ZodString>;
        } & {
            audfeeExGst: z.ZodOptional<z.ZodEffects<z.ZodNullable<z.ZodNumber>, number | null, unknown>>;
            audGst: z.ZodOptional<z.ZodEffects<z.ZodNullable<z.ZodNumber>, number | null, unknown>>;
            audtotal: z.ZodOptional<z.ZodEffects<z.ZodNullable<z.ZodNumber>, number | null, unknown>>;
            type: z.ZodOptional<z.ZodString>;
            otc: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            amount: number;
            rate: number;
            total: number;
            coin: string;
            type?: string | undefined;
            market?: string | undefined;
            solddate?: string | undefined;
            audfeeExGst?: number | null | undefined;
            audGst?: number | null | undefined;
            audtotal?: number | null | undefined;
            otc?: boolean | undefined;
        }, {
            coin: string;
            type?: string | undefined;
            amount?: unknown;
            rate?: unknown;
            total?: unknown;
            market?: string | undefined;
            solddate?: string | undefined;
            audfeeExGst?: unknown;
            audGst?: unknown;
            audtotal?: unknown;
            otc?: boolean | undefined;
        }>, "many">;
        sellorders: z.ZodArray<z.ZodObject<{
            amount: z.ZodEffects<z.ZodNumber, number, unknown>;
            rate: z.ZodEffects<z.ZodNumber, number, unknown>;
            total: z.ZodEffects<z.ZodNumber, number, unknown>;
            coin: z.ZodString;
            market: z.ZodOptional<z.ZodString>;
        } & {
            solddate: z.ZodOptional<z.ZodString>;
        } & {
            audfeeExGst: z.ZodOptional<z.ZodEffects<z.ZodNullable<z.ZodNumber>, number | null, unknown>>;
            audGst: z.ZodOptional<z.ZodEffects<z.ZodNullable<z.ZodNumber>, number | null, unknown>>;
            audtotal: z.ZodOptional<z.ZodEffects<z.ZodNullable<z.ZodNumber>, number | null, unknown>>;
            type: z.ZodOptional<z.ZodString>;
            otc: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            amount: number;
            rate: number;
            total: number;
            coin: string;
            type?: string | undefined;
            market?: string | undefined;
            solddate?: string | undefined;
            audfeeExGst?: number | null | undefined;
            audGst?: number | null | undefined;
            audtotal?: number | null | undefined;
            otc?: boolean | undefined;
        }, {
            coin: string;
            type?: string | undefined;
            amount?: unknown;
            rate?: unknown;
            total?: unknown;
            market?: string | undefined;
            solddate?: string | undefined;
            audfeeExGst?: unknown;
            audGst?: unknown;
            audtotal?: unknown;
            otc?: boolean | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        status: string;
        buyorders: {
            amount: number;
            rate: number;
            total: number;
            coin: string;
            type?: string | undefined;
            market?: string | undefined;
            solddate?: string | undefined;
            audfeeExGst?: number | null | undefined;
            audGst?: number | null | undefined;
            audtotal?: number | null | undefined;
            otc?: boolean | undefined;
        }[];
        sellorders: {
            amount: number;
            rate: number;
            total: number;
            coin: string;
            type?: string | undefined;
            market?: string | undefined;
            solddate?: string | undefined;
            audfeeExGst?: number | null | undefined;
            audGst?: number | null | undefined;
            audtotal?: number | null | undefined;
            otc?: boolean | undefined;
        }[];
        message?: string | undefined;
    }, {
        status: string;
        buyorders: {
            coin: string;
            type?: string | undefined;
            amount?: unknown;
            rate?: unknown;
            total?: unknown;
            market?: string | undefined;
            solddate?: string | undefined;
            audfeeExGst?: unknown;
            audGst?: unknown;
            audtotal?: unknown;
            otc?: boolean | undefined;
        }[];
        sellorders: {
            coin: string;
            type?: string | undefined;
            amount?: unknown;
            rate?: unknown;
            total?: unknown;
            market?: string | undefined;
            solddate?: string | undefined;
            audfeeExGst?: unknown;
            audGst?: unknown;
            audtotal?: unknown;
            otc?: boolean | undefined;
        }[];
        message?: string | undefined;
    }>;
    accountBalances: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        balances: z.ZodArray<z.ZodRecord<z.ZodString, z.ZodObject<{
            balance: z.ZodEffects<z.ZodNumber, number, unknown>;
            available: z.ZodOptional<z.ZodEffects<z.ZodNullable<z.ZodNumber>, number | null, unknown>>;
            audbalance: z.ZodEffects<z.ZodNumber, number, unknown>;
            rate: z.ZodEffects<z.ZodNumber, number, unknown>;
        }, "strip", z.ZodTypeAny, {
            rate: number;
            balance: number;
            audbalance: number;
            available?: number | null | undefined;
        }, {
            rate?: unknown;
            balance?: unknown;
            available?: unknown;
            audbalance?: unknown;
        }>>, "many">;
    }, "strip", z.ZodTypeAny, {
        status: string;
        balances: Record<string, {
            rate: number;
            balance: number;
            audbalance: number;
            available?: number | null | undefined;
        }>[];
        message?: string | undefined;
    }, {
        status: string;
        balances: Record<string, {
            rate?: unknown;
            balance?: unknown;
            available?: unknown;
            audbalance?: unknown;
        }>[];
        message?: string | undefined;
    }>;
    assetBalance: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        balance: z.ZodRecord<z.ZodString, z.ZodObject<{
            balance: z.ZodEffects<z.ZodNumber, number, unknown>;
            available: z.ZodOptional<z.ZodEffects<z.ZodNullable<z.ZodNumber>, number | null, unknown>>;
            audbalance: z.ZodEffects<z.ZodNumber, number, unknown>;
            rate: z.ZodEffects<z.ZodNumber, number, unknown>;
        }, "strip", z.ZodTypeAny, {
            rate: number;
            balance: number;
            audbalance: number;
            available?: number | null | undefined;
        }, {
            rate?: unknown;
            balance?: unknown;
            available?: unknown;
            audbalance?: unknown;
        }>>;
    }, "strip", z.ZodTypeAny, {
        status: string;
        balance: Record<string, {
            rate: number;
            balance: number;
            audbalance: number;
            available?: number | null | undefined;
        }>;
        message?: string | undefined;
    }, {
        status: string;
        balance: Record<string, {
            rate?: unknown;
            balance?: unknown;
            available?: unknown;
            audbalance?: unknown;
        }>;
        message?: string | undefined;
    }>;
    openMarketOrders: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        buyorders: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            coin: z.ZodString;
            market: z.ZodString;
            amount: z.ZodEffects<z.ZodNumber, number, unknown>;
            created: z.ZodString;
            rate: z.ZodEffects<z.ZodNumber, number, unknown>;
            total: z.ZodEffects<z.ZodNumber, number, unknown>;
        }, "strip", z.ZodTypeAny, {
            amount: number;
            rate: number;
            total: number;
            coin: string;
            market: string;
            id: string;
            created: string;
        }, {
            coin: string;
            market: string;
            id: string;
            created: string;
            amount?: unknown;
            rate?: unknown;
            total?: unknown;
        }>, "many">;
        sellorders: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            coin: z.ZodString;
            market: z.ZodString;
            amount: z.ZodEffects<z.ZodNumber, number, unknown>;
            created: z.ZodString;
            rate: z.ZodEffects<z.ZodNumber, number, unknown>;
            total: z.ZodEffects<z.ZodNumber, number, unknown>;
        }, "strip", z.ZodTypeAny, {
            amount: number;
            rate: number;
            total: number;
            coin: string;
            market: string;
            id: string;
            created: string;
        }, {
            coin: string;
            market: string;
            id: string;
            created: string;
            amount?: unknown;
            rate?: unknown;
            total?: unknown;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        status: string;
        buyorders: {
            amount: number;
            rate: number;
            total: number;
            coin: string;
            market: string;
            id: string;
            created: string;
        }[];
        sellorders: {
            amount: number;
            rate: number;
            total: number;
            coin: string;
            market: string;
            id: string;
            created: string;
        }[];
        message?: string | undefined;
    }, {
        status: string;
        buyorders: {
            coin: string;
            market: string;
            id: string;
            created: string;
            amount?: unknown;
            rate?: unknown;
            total?: unknown;
        }[];
        sellorders: {
            coin: string;
            market: string;
            id: string;
            created: string;
            amount?: unknown;
            rate?: unknown;
            total?: unknown;
        }[];
        message?: string | undefined;
    }>;
    openLimitOrders: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        buyorders: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            coin: z.ZodString;
            market: z.ZodString;
            rate: z.ZodEffects<z.ZodNumber, number, unknown>;
            amount: z.ZodEffects<z.ZodNumber, number, unknown>;
            created: z.ZodString;
            type: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            type: string;
            amount: number;
            rate: number;
            coin: string;
            market: string;
            id: string;
            created: string;
        }, {
            type: string;
            coin: string;
            market: string;
            id: string;
            created: string;
            amount?: unknown;
            rate?: unknown;
        }>, "many">;
        sellorders: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            coin: z.ZodString;
            market: z.ZodString;
            rate: z.ZodEffects<z.ZodNumber, number, unknown>;
            amount: z.ZodEffects<z.ZodNumber, number, unknown>;
            created: z.ZodString;
            type: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            type: string;
            amount: number;
            rate: number;
            coin: string;
            market: string;
            id: string;
            created: string;
        }, {
            type: string;
            coin: string;
            market: string;
            id: string;
            created: string;
            amount?: unknown;
            rate?: unknown;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        status: string;
        buyorders: {
            type: string;
            amount: number;
            rate: number;
            coin: string;
            market: string;
            id: string;
            created: string;
        }[];
        sellorders: {
            type: string;
            amount: number;
            rate: number;
            coin: string;
            market: string;
            id: string;
            created: string;
        }[];
        message?: string | undefined;
    }, {
        status: string;
        buyorders: {
            type: string;
            coin: string;
            market: string;
            id: string;
            created: string;
            amount?: unknown;
            rate?: unknown;
        }[];
        sellorders: {
            type: string;
            coin: string;
            market: string;
            id: string;
            created: string;
            amount?: unknown;
            rate?: unknown;
        }[];
        message?: string | undefined;
    }>;
    allOrders: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        buyorders: z.ZodArray<z.ZodObject<{
            amount: z.ZodEffects<z.ZodNumber, number, unknown>;
            rate: z.ZodEffects<z.ZodNumber, number, unknown>;
            total: z.ZodEffects<z.ZodNumber, number, unknown>;
            coin: z.ZodString;
            market: z.ZodOptional<z.ZodString>;
        } & {
            solddate: z.ZodOptional<z.ZodString>;
        } & {
            audfeeExGst: z.ZodOptional<z.ZodEffects<z.ZodNullable<z.ZodNumber>, number | null, unknown>>;
            audGst: z.ZodOptional<z.ZodEffects<z.ZodNullable<z.ZodNumber>, number | null, unknown>>;
            audtotal: z.ZodOptional<z.ZodEffects<z.ZodNullable<z.ZodNumber>, number | null, unknown>>;
            type: z.ZodOptional<z.ZodString>;
            otc: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            amount: number;
            rate: number;
            total: number;
            coin: string;
            type?: string | undefined;
            market?: string | undefined;
            solddate?: string | undefined;
            audfeeExGst?: number | null | undefined;
            audGst?: number | null | undefined;
            audtotal?: number | null | undefined;
            otc?: boolean | undefined;
        }, {
            coin: string;
            type?: string | undefined;
            amount?: unknown;
            rate?: unknown;
            total?: unknown;
            market?: string | undefined;
            solddate?: string | undefined;
            audfeeExGst?: unknown;
            audGst?: unknown;
            audtotal?: unknown;
            otc?: boolean | undefined;
        }>, "many">;
        sellorders: z.ZodArray<z.ZodObject<{
            amount: z.ZodEffects<z.ZodNumber, number, unknown>;
            rate: z.ZodEffects<z.ZodNumber, number, unknown>;
            total: z.ZodEffects<z.ZodNumber, number, unknown>;
            coin: z.ZodString;
            market: z.ZodOptional<z.ZodString>;
        } & {
            solddate: z.ZodOptional<z.ZodString>;
        } & {
            audfeeExGst: z.ZodOptional<z.ZodEffects<z.ZodNullable<z.ZodNumber>, number | null, unknown>>;
            audGst: z.ZodOptional<z.ZodEffects<z.ZodNullable<z.ZodNumber>, number | null, unknown>>;
            audtotal: z.ZodOptional<z.ZodEffects<z.ZodNullable<z.ZodNumber>, number | null, unknown>>;
            type: z.ZodOptional<z.ZodString>;
            otc: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            amount: number;
            rate: number;
            total: number;
            coin: string;
            type?: string | undefined;
            market?: string | undefined;
            solddate?: string | undefined;
            audfeeExGst?: number | null | undefined;
            audGst?: number | null | undefined;
            audtotal?: number | null | undefined;
            otc?: boolean | undefined;
        }, {
            coin: string;
            type?: string | undefined;
            amount?: unknown;
            rate?: unknown;
            total?: unknown;
            market?: string | undefined;
            solddate?: string | undefined;
            audfeeExGst?: unknown;
            audGst?: unknown;
            audtotal?: unknown;
            otc?: boolean | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        status: string;
        buyorders: {
            amount: number;
            rate: number;
            total: number;
            coin: string;
            type?: string | undefined;
            market?: string | undefined;
            solddate?: string | undefined;
            audfeeExGst?: number | null | undefined;
            audGst?: number | null | undefined;
            audtotal?: number | null | undefined;
            otc?: boolean | undefined;
        }[];
        sellorders: {
            amount: number;
            rate: number;
            total: number;
            coin: string;
            type?: string | undefined;
            market?: string | undefined;
            solddate?: string | undefined;
            audfeeExGst?: number | null | undefined;
            audGst?: number | null | undefined;
            audtotal?: number | null | undefined;
            otc?: boolean | undefined;
        }[];
        message?: string | undefined;
    }, {
        status: string;
        buyorders: {
            coin: string;
            type?: string | undefined;
            amount?: unknown;
            rate?: unknown;
            total?: unknown;
            market?: string | undefined;
            solddate?: string | undefined;
            audfeeExGst?: unknown;
            audGst?: unknown;
            audtotal?: unknown;
            otc?: boolean | undefined;
        }[];
        sellorders: {
            coin: string;
            type?: string | undefined;
            amount?: unknown;
            rate?: unknown;
            total?: unknown;
            market?: string | undefined;
            solddate?: string | undefined;
            audfeeExGst?: unknown;
            audGst?: unknown;
            audtotal?: unknown;
            otc?: boolean | undefined;
        }[];
        message?: string | undefined;
    }>;
    allMarketOrders: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        buyorders: z.ZodArray<z.ZodObject<{
            amount: z.ZodEffects<z.ZodNumber, number, unknown>;
            rate: z.ZodEffects<z.ZodNumber, number, unknown>;
            total: z.ZodEffects<z.ZodNumber, number, unknown>;
            coin: z.ZodString;
            market: z.ZodOptional<z.ZodString>;
        } & {
            solddate: z.ZodOptional<z.ZodString>;
        } & {
            audfeeExGst: z.ZodOptional<z.ZodEffects<z.ZodNullable<z.ZodNumber>, number | null, unknown>>;
            audGst: z.ZodOptional<z.ZodEffects<z.ZodNullable<z.ZodNumber>, number | null, unknown>>;
            audtotal: z.ZodOptional<z.ZodEffects<z.ZodNullable<z.ZodNumber>, number | null, unknown>>;
            type: z.ZodOptional<z.ZodString>;
            otc: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            amount: number;
            rate: number;
            total: number;
            coin: string;
            type?: string | undefined;
            market?: string | undefined;
            solddate?: string | undefined;
            audfeeExGst?: number | null | undefined;
            audGst?: number | null | undefined;
            audtotal?: number | null | undefined;
            otc?: boolean | undefined;
        }, {
            coin: string;
            type?: string | undefined;
            amount?: unknown;
            rate?: unknown;
            total?: unknown;
            market?: string | undefined;
            solddate?: string | undefined;
            audfeeExGst?: unknown;
            audGst?: unknown;
            audtotal?: unknown;
            otc?: boolean | undefined;
        }>, "many">;
        sellorders: z.ZodArray<z.ZodObject<{
            amount: z.ZodEffects<z.ZodNumber, number, unknown>;
            rate: z.ZodEffects<z.ZodNumber, number, unknown>;
            total: z.ZodEffects<z.ZodNumber, number, unknown>;
            coin: z.ZodString;
            market: z.ZodOptional<z.ZodString>;
        } & {
            solddate: z.ZodOptional<z.ZodString>;
        } & {
            audfeeExGst: z.ZodOptional<z.ZodEffects<z.ZodNullable<z.ZodNumber>, number | null, unknown>>;
            audGst: z.ZodOptional<z.ZodEffects<z.ZodNullable<z.ZodNumber>, number | null, unknown>>;
            audtotal: z.ZodOptional<z.ZodEffects<z.ZodNullable<z.ZodNumber>, number | null, unknown>>;
            type: z.ZodOptional<z.ZodString>;
            otc: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            amount: number;
            rate: number;
            total: number;
            coin: string;
            type?: string | undefined;
            market?: string | undefined;
            solddate?: string | undefined;
            audfeeExGst?: number | null | undefined;
            audGst?: number | null | undefined;
            audtotal?: number | null | undefined;
            otc?: boolean | undefined;
        }, {
            coin: string;
            type?: string | undefined;
            amount?: unknown;
            rate?: unknown;
            total?: unknown;
            market?: string | undefined;
            solddate?: string | undefined;
            audfeeExGst?: unknown;
            audGst?: unknown;
            audtotal?: unknown;
            otc?: boolean | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        status: string;
        buyorders: {
            amount: number;
            rate: number;
            total: number;
            coin: string;
            type?: string | undefined;
            market?: string | undefined;
            solddate?: string | undefined;
            audfeeExGst?: number | null | undefined;
            audGst?: number | null | undefined;
            audtotal?: number | null | undefined;
            otc?: boolean | undefined;
        }[];
        sellorders: {
            amount: number;
            rate: number;
            total: number;
            coin: string;
            type?: string | undefined;
            market?: string | undefined;
            solddate?: string | undefined;
            audfeeExGst?: number | null | undefined;
            audGst?: number | null | undefined;
            audtotal?: number | null | undefined;
            otc?: boolean | undefined;
        }[];
        message?: string | undefined;
    }, {
        status: string;
        buyorders: {
            coin: string;
            type?: string | undefined;
            amount?: unknown;
            rate?: unknown;
            total?: unknown;
            market?: string | undefined;
            solddate?: string | undefined;
            audfeeExGst?: unknown;
            audGst?: unknown;
            audtotal?: unknown;
            otc?: boolean | undefined;
        }[];
        sellorders: {
            coin: string;
            type?: string | undefined;
            amount?: unknown;
            rate?: unknown;
            total?: unknown;
            market?: string | undefined;
            solddate?: string | undefined;
            audfeeExGst?: unknown;
            audGst?: unknown;
            audtotal?: unknown;
            otc?: boolean | undefined;
        }[];
        message?: string | undefined;
    }>;
    transferHistory: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        sendtransactions: z.ZodArray<z.ZodObject<{
            timestamp: z.ZodString;
            amount: z.ZodEffects<z.ZodNumber, number, unknown>;
            coin: z.ZodString;
            address: z.ZodString;
            aud: z.ZodOptional<z.ZodEffects<z.ZodNullable<z.ZodNumber>, number | null, unknown>>;
            sendfee: z.ZodOptional<z.ZodEffects<z.ZodNullable<z.ZodNumber>, number | null, unknown>>;
        }, "strip", z.ZodTypeAny, {
            amount: number;
            coin: string;
            address: string;
            timestamp: string;
            aud?: number | null | undefined;
            sendfee?: number | null | undefined;
        }, {
            coin: string;
            address: string;
            timestamp: string;
            amount?: unknown;
            aud?: unknown;
            sendfee?: unknown;
        }>, "many">;
        receivetransactions: z.ZodArray<z.ZodObject<{
            timestamp: z.ZodString;
            amount: z.ZodEffects<z.ZodNumber, number, unknown>;
            coin: z.ZodString;
            address: z.ZodString;
            aud: z.ZodOptional<z.ZodEffects<z.ZodNullable<z.ZodNumber>, number | null, unknown>>;
            from: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            amount: number;
            coin: string;
            address: string;
            timestamp: string;
            aud?: number | null | undefined;
            from?: string | undefined;
        }, {
            coin: string;
            address: string;
            timestamp: string;
            amount?: unknown;
            aud?: unknown;
            from?: string | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        status: string;
        sendtransactions: {
            amount: number;
            coin: string;
            address: string;
            timestamp: string;
            aud?: number | null | undefined;
            sendfee?: number | null | undefined;
        }[];
        receivetransactions: {
            amount: number;
            coin: string;
            address: string;
            timestamp: string;
            aud?: number | null | undefined;
            from?: string | undefined;
        }[];
        message?: string | undefined;
    }, {
        status: string;
        sendtransactions: {
            coin: string;
            address: string;
            timestamp: string;
            amount?: unknown;
            aud?: unknown;
            sendfee?: unknown;
        }[];
        receivetransactions: {
            coin: string;
            address: string;
            timestamp: string;
            amount?: unknown;
            aud?: unknown;
            from?: string | undefined;
        }[];
        message?: string | undefined;
    }>;
    fiatDepositHistory: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        deposits: z.ZodArray<z.ZodObject<{
            amount: z.ZodEffects<z.ZodNumber, number, unknown>;
            created: z.ZodString;
            status: z.ZodString;
            type: z.ZodString;
            reference: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            status: string;
            type: string;
            amount: number;
            created: string;
            reference: string;
        }, {
            status: string;
            type: string;
            created: string;
            reference: string;
            amount?: unknown;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        status: string;
        deposits: {
            status: string;
            type: string;
            amount: number;
            created: string;
            reference: string;
        }[];
        message?: string | undefined;
    }, {
        status: string;
        deposits: {
            status: string;
            type: string;
            created: string;
            reference: string;
            amount?: unknown;
        }[];
        message?: string | undefined;
    }>;
    fiatWithdrawalHistory: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        withdrawals: z.ZodArray<z.ZodObject<{
            amount: z.ZodEffects<z.ZodNumber, number, unknown>;
            created: z.ZodString;
            status: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            status: string;
            amount: number;
            created: string;
        }, {
            status: string;
            created: string;
            amount?: unknown;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        status: string;
        withdrawals: {
            status: string;
            amount: number;
            created: string;
        }[];
        message?: string | undefined;
    }, {
        status: string;
        withdrawals: {
            status: string;
            created: string;
            amount?: unknown;
        }[];
        message?: string | undefined;
    }>;
    affiliatePayments: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        payments: z.ZodArray<z.ZodObject<{
            amount: z.ZodEffects<z.ZodNumber, number, unknown>;
            month: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            amount: number;
            month: string;
        }, {
            month: string;
            amount?: unknown;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        status: string;
        payments: {
            amount: number;
            month: string;
        }[];
        message?: string | undefined;
    }, {
        status: string;
        payments: {
            month: string;
            amount?: unknown;
        }[];
        message?: string | undefined;
    }>;
    referralPayments: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        payments: z.ZodArray<z.ZodObject<{
            amount: z.ZodEffects<z.ZodNumber, number, unknown>;
            coin: z.ZodString;
            audamount: z.ZodEffects<z.ZodNumber, number, unknown>;
            timestamp: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            amount: number;
            coin: string;
            timestamp: string;
            audamount: number;
        }, {
            coin: string;
            timestamp: string;
            amount?: unknown;
            audamount?: unknown;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        status: string;
        payments: {
            amount: number;
            coin: string;
            timestamp: string;
            audamount: number;
        }[];
        message?: string | undefined;
    }, {
        status: string;
        payments: {
            coin: string;
            timestamp: string;
            amount?: unknown;
            audamount?: unknown;
        }[];
        message?: string | undefined;
    }>;
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
