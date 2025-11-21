import { z } from 'zod';
export declare const schemas: {
    status: z.ZodObject<{
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
    latestPrices: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        prices: z.ZodRecord<z.ZodString, z.ZodObject<{
            bid: z.ZodNumber;
            ask: z.ZodNumber;
            last: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            bid: number;
            ask: number;
            last: number;
        }, {
            bid: number;
            ask: number;
            last: number;
        }>>;
    }, "strip", z.ZodTypeAny, {
        status: string;
        prices: Record<string, {
            bid: number;
            ask: number;
            last: number;
        }>;
        message?: string | undefined;
    }, {
        status: string;
        prices: Record<string, {
            bid: number;
            ask: number;
            last: number;
        }>;
        message?: string | undefined;
    }>;
    latestCoinPrices: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        prices: z.ZodObject<{
            bid: z.ZodNumber;
            ask: z.ZodNumber;
            last: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            bid: number;
            ask: number;
            last: number;
        }, {
            bid: number;
            ask: number;
            last: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        status: string;
        prices: {
            bid: number;
            ask: number;
            last: number;
        };
        message?: string | undefined;
    }, {
        status: string;
        prices: {
            bid: number;
            ask: number;
            last: number;
        };
        message?: string | undefined;
    }>;
    latestRate: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        rate: z.ZodNumber;
        market: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        status: string;
        rate: number;
        market: string;
        message?: string | undefined;
    }, {
        status: string;
        rate: number;
        market: string;
        message?: string | undefined;
    }>;
    orderBook: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        buyorders: z.ZodArray<z.ZodObject<{
            amount: z.ZodNumber;
            rate: z.ZodNumber;
            total: z.ZodNumber;
            coin: z.ZodString;
            market: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            amount: number;
            rate: number;
            total: number;
            coin: string;
            market?: string | undefined;
        }, {
            amount: number;
            rate: number;
            total: number;
            coin: string;
            market?: string | undefined;
        }>, "many">;
        sellorders: z.ZodArray<z.ZodObject<{
            amount: z.ZodNumber;
            rate: z.ZodNumber;
            total: z.ZodNumber;
            coin: z.ZodString;
            market: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            amount: number;
            rate: number;
            total: number;
            coin: string;
            market?: string | undefined;
        }, {
            amount: number;
            rate: number;
            total: number;
            coin: string;
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
    }>;
    completedOrders: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        buyorders: z.ZodArray<z.ZodObject<{
            amount: z.ZodNumber;
            rate: z.ZodNumber;
            total: z.ZodNumber;
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
            amount: number;
            rate: number;
            total: number;
            coin: string;
            market?: string | undefined;
            solddate?: string | undefined;
        }>, "many">;
        sellorders: z.ZodArray<z.ZodObject<{
            amount: z.ZodNumber;
            rate: z.ZodNumber;
            total: z.ZodNumber;
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
            amount: number;
            rate: number;
            total: number;
            coin: string;
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
    }>;
    completedOrdersSummary: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        orders: z.ZodArray<z.ZodObject<{
            amount: z.ZodNumber;
            rate: z.ZodNumber;
            total: z.ZodNumber;
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
            amount: number;
            rate: number;
            total: number;
            coin: string;
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
            amount: number;
            rate: number;
            total: number;
            coin: string;
            market?: string | undefined;
            solddate?: string | undefined;
        }[];
        message?: string | undefined;
    }>;
    depositAddresses: z.ZodObject<{
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
    quote: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        rate: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        status: string;
        rate: number;
        message?: string | undefined;
    }, {
        status: string;
        rate: number;
        message?: string | undefined;
    }>;
    placedOrder: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        coin: z.ZodString;
        market: z.ZodString;
        amount: z.ZodNumber;
        rate: z.ZodNumber;
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
        amount: number;
        rate: number;
        coin: string;
        market: string;
        id: string;
        message?: string | undefined;
    }>;
    editedBuyOrder: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        id: z.ZodString;
        coin: z.ZodString;
        rate: z.ZodNumber;
        newrate: z.ZodNumber;
        amount: z.ZodNumber;
        total: z.ZodNumber;
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
        amount: number;
        rate: number;
        total: number;
        coin: string;
        id: string;
        newrate: number;
        updated: boolean;
        message?: string | undefined;
    }>;
    editedSellOrder: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        id: z.ZodString;
        coin: z.ZodString;
        rate: z.ZodNumber;
        newrate: z.ZodNumber;
        amount: z.ZodNumber;
        total: z.ZodNumber;
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
        amount: number;
        rate: number;
        total: number;
        coin: string;
        id: string;
        newrate: number;
        updated: boolean;
        message?: string | undefined;
    }>;
    buyNowExecution: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        coin: z.ZodString;
        amount: z.ZodNumber;
        market: z.ZodString;
        total: z.ZodNumber;
        rate: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        status: string;
        amount: number;
        total: number;
        coin: string;
        market: string;
        message?: string | undefined;
        rate?: number | undefined;
    }, {
        status: string;
        amount: number;
        total: number;
        coin: string;
        market: string;
        message?: string | undefined;
        rate?: number | undefined;
    }>;
    sellNowExecution: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        coin: z.ZodString;
        amount: z.ZodNumber;
        market: z.ZodString;
        total: z.ZodNumber;
        rate: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        status: string;
        amount: number;
        total: number;
        coin: string;
        market: string;
        message?: string | undefined;
        rate?: number | undefined;
    }, {
        status: string;
        amount: number;
        total: number;
        coin: string;
        market: string;
        message?: string | undefined;
        rate?: number | undefined;
    }>;
    swapNowExecution: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        coin: z.ZodString;
        amount: z.ZodNumber;
        market: z.ZodString;
        total: z.ZodNumber;
        rate: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        status: string;
        amount: number;
        total: number;
        coin: string;
        market: string;
        message?: string | undefined;
        rate?: number | undefined;
    }, {
        status: string;
        amount: number;
        total: number;
        coin: string;
        market: string;
        message?: string | undefined;
        rate?: number | undefined;
    }>;
    cancel: z.ZodObject<{
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
    withdrawalDetails: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        networks: z.ZodArray<z.ZodObject<{
            network: z.ZodString;
            paymentid: z.ZodOptional<z.ZodString>;
            fee: z.ZodOptional<z.ZodNumber>;
            minsend: z.ZodOptional<z.ZodNumber>;
            default: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            network: string;
            paymentid?: string | undefined;
            fee?: number | undefined;
            minsend?: number | undefined;
            default?: boolean | undefined;
        }, {
            network: string;
            paymentid?: string | undefined;
            fee?: number | undefined;
            minsend?: number | undefined;
            default?: boolean | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        status: string;
        networks: {
            network: string;
            paymentid?: string | undefined;
            fee?: number | undefined;
            minsend?: number | undefined;
            default?: boolean | undefined;
        }[];
        message?: string | undefined;
    }, {
        status: string;
        networks: {
            network: string;
            paymentid?: string | undefined;
            fee?: number | undefined;
            minsend?: number | undefined;
            default?: boolean | undefined;
        }[];
        message?: string | undefined;
    }>;
    sendCoins: z.ZodObject<{
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
    roMarketOrders: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        buyorders: z.ZodArray<z.ZodObject<{
            amount: z.ZodNumber;
            rate: z.ZodNumber;
            total: z.ZodNumber;
            coin: z.ZodString;
            market: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            amount: number;
            rate: number;
            total: number;
            coin: string;
            market?: string | undefined;
        }, {
            amount: number;
            rate: number;
            total: number;
            coin: string;
            market?: string | undefined;
        }>, "many">;
        sellorders: z.ZodArray<z.ZodObject<{
            amount: z.ZodNumber;
            rate: z.ZodNumber;
            total: z.ZodNumber;
            coin: z.ZodString;
            market: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            amount: number;
            rate: number;
            total: number;
            coin: string;
            market?: string | undefined;
        }, {
            amount: number;
            rate: number;
            total: number;
            coin: string;
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
    }>;
    roMarketOrdersWithFees: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        buyorders: z.ZodArray<z.ZodObject<{
            amount: z.ZodNumber;
            rate: z.ZodNumber;
            total: z.ZodNumber;
            coin: z.ZodString;
            market: z.ZodOptional<z.ZodString>;
        } & {
            solddate: z.ZodOptional<z.ZodString>;
        } & {
            audfeeExGst: z.ZodOptional<z.ZodNumber>;
            audGst: z.ZodOptional<z.ZodNumber>;
            audtotal: z.ZodOptional<z.ZodNumber>;
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
            audfeeExGst?: number | undefined;
            audGst?: number | undefined;
            audtotal?: number | undefined;
            otc?: boolean | undefined;
        }, {
            amount: number;
            rate: number;
            total: number;
            coin: string;
            type?: string | undefined;
            market?: string | undefined;
            solddate?: string | undefined;
            audfeeExGst?: number | undefined;
            audGst?: number | undefined;
            audtotal?: number | undefined;
            otc?: boolean | undefined;
        }>, "many">;
        sellorders: z.ZodArray<z.ZodObject<{
            amount: z.ZodNumber;
            rate: z.ZodNumber;
            total: z.ZodNumber;
            coin: z.ZodString;
            market: z.ZodOptional<z.ZodString>;
        } & {
            solddate: z.ZodOptional<z.ZodString>;
        } & {
            audfeeExGst: z.ZodOptional<z.ZodNumber>;
            audGst: z.ZodOptional<z.ZodNumber>;
            audtotal: z.ZodOptional<z.ZodNumber>;
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
            audfeeExGst?: number | undefined;
            audGst?: number | undefined;
            audtotal?: number | undefined;
            otc?: boolean | undefined;
        }, {
            amount: number;
            rate: number;
            total: number;
            coin: string;
            type?: string | undefined;
            market?: string | undefined;
            solddate?: string | undefined;
            audfeeExGst?: number | undefined;
            audGst?: number | undefined;
            audtotal?: number | undefined;
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
            audfeeExGst?: number | undefined;
            audGst?: number | undefined;
            audtotal?: number | undefined;
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
            audfeeExGst?: number | undefined;
            audGst?: number | undefined;
            audtotal?: number | undefined;
            otc?: boolean | undefined;
        }[];
        message?: string | undefined;
    }, {
        status: string;
        buyorders: {
            amount: number;
            rate: number;
            total: number;
            coin: string;
            type?: string | undefined;
            market?: string | undefined;
            solddate?: string | undefined;
            audfeeExGst?: number | undefined;
            audGst?: number | undefined;
            audtotal?: number | undefined;
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
            audfeeExGst?: number | undefined;
            audGst?: number | undefined;
            audtotal?: number | undefined;
            otc?: boolean | undefined;
        }[];
        message?: string | undefined;
    }>;
    roBalances: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        balances: z.ZodArray<z.ZodRecord<z.ZodString, z.ZodObject<{
            balance: z.ZodNumber;
            available: z.ZodOptional<z.ZodNumber>;
            audbalance: z.ZodNumber;
            rate: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            rate: number;
            balance: number;
            audbalance: number;
            available?: number | undefined;
        }, {
            rate: number;
            balance: number;
            audbalance: number;
            available?: number | undefined;
        }>>, "many">;
    }, "strip", z.ZodTypeAny, {
        status: string;
        balances: Record<string, {
            rate: number;
            balance: number;
            audbalance: number;
            available?: number | undefined;
        }>[];
        message?: string | undefined;
    }, {
        status: string;
        balances: Record<string, {
            rate: number;
            balance: number;
            audbalance: number;
            available?: number | undefined;
        }>[];
        message?: string | undefined;
    }>;
    roBalanceForCoin: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        balance: z.ZodRecord<z.ZodString, z.ZodObject<{
            balance: z.ZodNumber;
            available: z.ZodOptional<z.ZodNumber>;
            audbalance: z.ZodNumber;
            rate: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            rate: number;
            balance: number;
            audbalance: number;
            available?: number | undefined;
        }, {
            rate: number;
            balance: number;
            audbalance: number;
            available?: number | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        status: string;
        balance: Record<string, {
            rate: number;
            balance: number;
            audbalance: number;
            available?: number | undefined;
        }>;
        message?: string | undefined;
    }, {
        status: string;
        balance: Record<string, {
            rate: number;
            balance: number;
            audbalance: number;
            available?: number | undefined;
        }>;
        message?: string | undefined;
    }>;
    roMyOpenMarketOrders: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        buyorders: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            coin: z.ZodString;
            market: z.ZodString;
            amount: z.ZodNumber;
            created: z.ZodString;
            rate: z.ZodNumber;
            total: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            amount: number;
            rate: number;
            total: number;
            coin: string;
            market: string;
            id: string;
            created: string;
        }, {
            amount: number;
            rate: number;
            total: number;
            coin: string;
            market: string;
            id: string;
            created: string;
        }>, "many">;
        sellorders: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            coin: z.ZodString;
            market: z.ZodString;
            amount: z.ZodNumber;
            created: z.ZodString;
            rate: z.ZodNumber;
            total: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            amount: number;
            rate: number;
            total: number;
            coin: string;
            market: string;
            id: string;
            created: string;
        }, {
            amount: number;
            rate: number;
            total: number;
            coin: string;
            market: string;
            id: string;
            created: string;
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
    }>;
    roMyOpenLimitOrders: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        buyorders: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            coin: z.ZodString;
            market: z.ZodString;
            rate: z.ZodNumber;
            amount: z.ZodNumber;
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
            amount: number;
            rate: number;
            coin: string;
            market: string;
            id: string;
            created: string;
        }>, "many">;
        sellorders: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            coin: z.ZodString;
            market: z.ZodString;
            rate: z.ZodNumber;
            amount: z.ZodNumber;
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
            amount: number;
            rate: number;
            coin: string;
            market: string;
            id: string;
            created: string;
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
    }>;
    roMyOrdersHistory: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        buyorders: z.ZodArray<z.ZodObject<{
            amount: z.ZodNumber;
            rate: z.ZodNumber;
            total: z.ZodNumber;
            coin: z.ZodString;
            market: z.ZodOptional<z.ZodString>;
        } & {
            solddate: z.ZodOptional<z.ZodString>;
        } & {
            audfeeExGst: z.ZodOptional<z.ZodNumber>;
            audGst: z.ZodOptional<z.ZodNumber>;
            audtotal: z.ZodOptional<z.ZodNumber>;
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
            audfeeExGst?: number | undefined;
            audGst?: number | undefined;
            audtotal?: number | undefined;
            otc?: boolean | undefined;
        }, {
            amount: number;
            rate: number;
            total: number;
            coin: string;
            type?: string | undefined;
            market?: string | undefined;
            solddate?: string | undefined;
            audfeeExGst?: number | undefined;
            audGst?: number | undefined;
            audtotal?: number | undefined;
            otc?: boolean | undefined;
        }>, "many">;
        sellorders: z.ZodArray<z.ZodObject<{
            amount: z.ZodNumber;
            rate: z.ZodNumber;
            total: z.ZodNumber;
            coin: z.ZodString;
            market: z.ZodOptional<z.ZodString>;
        } & {
            solddate: z.ZodOptional<z.ZodString>;
        } & {
            audfeeExGst: z.ZodOptional<z.ZodNumber>;
            audGst: z.ZodOptional<z.ZodNumber>;
            audtotal: z.ZodOptional<z.ZodNumber>;
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
            audfeeExGst?: number | undefined;
            audGst?: number | undefined;
            audtotal?: number | undefined;
            otc?: boolean | undefined;
        }, {
            amount: number;
            rate: number;
            total: number;
            coin: string;
            type?: string | undefined;
            market?: string | undefined;
            solddate?: string | undefined;
            audfeeExGst?: number | undefined;
            audGst?: number | undefined;
            audtotal?: number | undefined;
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
            audfeeExGst?: number | undefined;
            audGst?: number | undefined;
            audtotal?: number | undefined;
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
            audfeeExGst?: number | undefined;
            audGst?: number | undefined;
            audtotal?: number | undefined;
            otc?: boolean | undefined;
        }[];
        message?: string | undefined;
    }, {
        status: string;
        buyorders: {
            amount: number;
            rate: number;
            total: number;
            coin: string;
            type?: string | undefined;
            market?: string | undefined;
            solddate?: string | undefined;
            audfeeExGst?: number | undefined;
            audGst?: number | undefined;
            audtotal?: number | undefined;
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
            audfeeExGst?: number | undefined;
            audGst?: number | undefined;
            audtotal?: number | undefined;
            otc?: boolean | undefined;
        }[];
        message?: string | undefined;
    }>;
    roMyMarketOrdersHistory: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        buyorders: z.ZodArray<z.ZodObject<{
            amount: z.ZodNumber;
            rate: z.ZodNumber;
            total: z.ZodNumber;
            coin: z.ZodString;
            market: z.ZodOptional<z.ZodString>;
        } & {
            solddate: z.ZodOptional<z.ZodString>;
        } & {
            audfeeExGst: z.ZodOptional<z.ZodNumber>;
            audGst: z.ZodOptional<z.ZodNumber>;
            audtotal: z.ZodOptional<z.ZodNumber>;
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
            audfeeExGst?: number | undefined;
            audGst?: number | undefined;
            audtotal?: number | undefined;
            otc?: boolean | undefined;
        }, {
            amount: number;
            rate: number;
            total: number;
            coin: string;
            type?: string | undefined;
            market?: string | undefined;
            solddate?: string | undefined;
            audfeeExGst?: number | undefined;
            audGst?: number | undefined;
            audtotal?: number | undefined;
            otc?: boolean | undefined;
        }>, "many">;
        sellorders: z.ZodArray<z.ZodObject<{
            amount: z.ZodNumber;
            rate: z.ZodNumber;
            total: z.ZodNumber;
            coin: z.ZodString;
            market: z.ZodOptional<z.ZodString>;
        } & {
            solddate: z.ZodOptional<z.ZodString>;
        } & {
            audfeeExGst: z.ZodOptional<z.ZodNumber>;
            audGst: z.ZodOptional<z.ZodNumber>;
            audtotal: z.ZodOptional<z.ZodNumber>;
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
            audfeeExGst?: number | undefined;
            audGst?: number | undefined;
            audtotal?: number | undefined;
            otc?: boolean | undefined;
        }, {
            amount: number;
            rate: number;
            total: number;
            coin: string;
            type?: string | undefined;
            market?: string | undefined;
            solddate?: string | undefined;
            audfeeExGst?: number | undefined;
            audGst?: number | undefined;
            audtotal?: number | undefined;
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
            audfeeExGst?: number | undefined;
            audGst?: number | undefined;
            audtotal?: number | undefined;
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
            audfeeExGst?: number | undefined;
            audGst?: number | undefined;
            audtotal?: number | undefined;
            otc?: boolean | undefined;
        }[];
        message?: string | undefined;
    }, {
        status: string;
        buyorders: {
            amount: number;
            rate: number;
            total: number;
            coin: string;
            type?: string | undefined;
            market?: string | undefined;
            solddate?: string | undefined;
            audfeeExGst?: number | undefined;
            audGst?: number | undefined;
            audtotal?: number | undefined;
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
            audfeeExGst?: number | undefined;
            audGst?: number | undefined;
            audtotal?: number | undefined;
            otc?: boolean | undefined;
        }[];
        message?: string | undefined;
    }>;
    roSendReceive: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        sendtransactions: z.ZodArray<z.ZodObject<{
            timestamp: z.ZodString;
            amount: z.ZodNumber;
            coin: z.ZodString;
            address: z.ZodString;
            aud: z.ZodOptional<z.ZodNumber>;
            sendfee: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            amount: number;
            coin: string;
            address: string;
            timestamp: string;
            aud?: number | undefined;
            sendfee?: number | undefined;
        }, {
            amount: number;
            coin: string;
            address: string;
            timestamp: string;
            aud?: number | undefined;
            sendfee?: number | undefined;
        }>, "many">;
        receivetransactions: z.ZodArray<z.ZodObject<{
            timestamp: z.ZodString;
            amount: z.ZodNumber;
            coin: z.ZodString;
            address: z.ZodString;
            aud: z.ZodOptional<z.ZodNumber>;
            from: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            amount: number;
            coin: string;
            address: string;
            timestamp: string;
            aud?: number | undefined;
            from?: string | undefined;
        }, {
            amount: number;
            coin: string;
            address: string;
            timestamp: string;
            aud?: number | undefined;
            from?: string | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        status: string;
        sendtransactions: {
            amount: number;
            coin: string;
            address: string;
            timestamp: string;
            aud?: number | undefined;
            sendfee?: number | undefined;
        }[];
        receivetransactions: {
            amount: number;
            coin: string;
            address: string;
            timestamp: string;
            aud?: number | undefined;
            from?: string | undefined;
        }[];
        message?: string | undefined;
    }, {
        status: string;
        sendtransactions: {
            amount: number;
            coin: string;
            address: string;
            timestamp: string;
            aud?: number | undefined;
            sendfee?: number | undefined;
        }[];
        receivetransactions: {
            amount: number;
            coin: string;
            address: string;
            timestamp: string;
            aud?: number | undefined;
            from?: string | undefined;
        }[];
        message?: string | undefined;
    }>;
    roDeposits: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        deposits: z.ZodArray<z.ZodObject<{
            amount: z.ZodNumber;
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
            amount: number;
            created: string;
            reference: string;
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
            amount: number;
            created: string;
            reference: string;
        }[];
        message?: string | undefined;
    }>;
    roWithdrawals: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        withdrawals: z.ZodArray<z.ZodObject<{
            amount: z.ZodNumber;
            created: z.ZodString;
            status: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            status: string;
            amount: number;
            created: string;
        }, {
            status: string;
            amount: number;
            created: string;
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
            amount: number;
            created: string;
        }[];
        message?: string | undefined;
    }>;
    roAffiliatePayments: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        payments: z.ZodArray<z.ZodObject<{
            amount: z.ZodNumber;
            month: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            amount: number;
            month: string;
        }, {
            amount: number;
            month: string;
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
            amount: number;
            month: string;
        }[];
        message?: string | undefined;
    }>;
    roReferralPayments: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        payments: z.ZodArray<z.ZodObject<{
            amount: z.ZodNumber;
            coin: z.ZodString;
            audamount: z.ZodNumber;
            timestamp: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            amount: number;
            coin: string;
            timestamp: string;
            audamount: number;
        }, {
            amount: number;
            coin: string;
            timestamp: string;
            audamount: number;
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
            amount: number;
            coin: string;
            timestamp: string;
            audamount: number;
        }[];
        message?: string | undefined;
    }>;
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
