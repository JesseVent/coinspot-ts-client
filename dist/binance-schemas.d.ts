import { z } from 'zod';
export declare const schemas: {
    ticker24hr: z.ZodArray<z.ZodObject<{
        symbol: z.ZodString;
        priceChange: z.ZodOptional<z.ZodString>;
        priceChangePercent: z.ZodOptional<z.ZodString>;
        weightedAvgPrice: z.ZodOptional<z.ZodString>;
        prevClosePrice: z.ZodOptional<z.ZodString>;
        lastPrice: z.ZodString;
        lastQty: z.ZodOptional<z.ZodString>;
        bidPrice: z.ZodString;
        bidQty: z.ZodOptional<z.ZodString>;
        askPrice: z.ZodString;
        askQty: z.ZodOptional<z.ZodString>;
        openPrice: z.ZodOptional<z.ZodString>;
        highPrice: z.ZodOptional<z.ZodString>;
        lowPrice: z.ZodOptional<z.ZodString>;
        volume: z.ZodOptional<z.ZodString>;
        quoteVolume: z.ZodOptional<z.ZodString>;
        openTime: z.ZodOptional<z.ZodNumber>;
        closeTime: z.ZodOptional<z.ZodNumber>;
        firstId: z.ZodOptional<z.ZodNumber>;
        lastId: z.ZodOptional<z.ZodNumber>;
        count: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        symbol: string;
        lastPrice: string;
        bidPrice: string;
        askPrice: string;
        priceChange?: string | undefined;
        priceChangePercent?: string | undefined;
        weightedAvgPrice?: string | undefined;
        prevClosePrice?: string | undefined;
        lastQty?: string | undefined;
        bidQty?: string | undefined;
        askQty?: string | undefined;
        openPrice?: string | undefined;
        highPrice?: string | undefined;
        lowPrice?: string | undefined;
        volume?: string | undefined;
        quoteVolume?: string | undefined;
        openTime?: number | undefined;
        closeTime?: number | undefined;
        firstId?: number | undefined;
        lastId?: number | undefined;
        count?: number | undefined;
    }, {
        symbol: string;
        lastPrice: string;
        bidPrice: string;
        askPrice: string;
        priceChange?: string | undefined;
        priceChangePercent?: string | undefined;
        weightedAvgPrice?: string | undefined;
        prevClosePrice?: string | undefined;
        lastQty?: string | undefined;
        bidQty?: string | undefined;
        askQty?: string | undefined;
        openPrice?: string | undefined;
        highPrice?: string | undefined;
        lowPrice?: string | undefined;
        volume?: string | undefined;
        quoteVolume?: string | undefined;
        openTime?: number | undefined;
        closeTime?: number | undefined;
        firstId?: number | undefined;
        lastId?: number | undefined;
        count?: number | undefined;
    }>, "many">;
    ticker24hrSymbol: z.ZodObject<{
        symbol: z.ZodString;
        priceChange: z.ZodOptional<z.ZodString>;
        priceChangePercent: z.ZodOptional<z.ZodString>;
        weightedAvgPrice: z.ZodOptional<z.ZodString>;
        prevClosePrice: z.ZodOptional<z.ZodString>;
        lastPrice: z.ZodString;
        lastQty: z.ZodOptional<z.ZodString>;
        bidPrice: z.ZodString;
        bidQty: z.ZodOptional<z.ZodString>;
        askPrice: z.ZodString;
        askQty: z.ZodOptional<z.ZodString>;
        openPrice: z.ZodOptional<z.ZodString>;
        highPrice: z.ZodOptional<z.ZodString>;
        lowPrice: z.ZodOptional<z.ZodString>;
        volume: z.ZodOptional<z.ZodString>;
        quoteVolume: z.ZodOptional<z.ZodString>;
        openTime: z.ZodOptional<z.ZodNumber>;
        closeTime: z.ZodOptional<z.ZodNumber>;
        firstId: z.ZodOptional<z.ZodNumber>;
        lastId: z.ZodOptional<z.ZodNumber>;
        count: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        symbol: string;
        lastPrice: string;
        bidPrice: string;
        askPrice: string;
        priceChange?: string | undefined;
        priceChangePercent?: string | undefined;
        weightedAvgPrice?: string | undefined;
        prevClosePrice?: string | undefined;
        lastQty?: string | undefined;
        bidQty?: string | undefined;
        askQty?: string | undefined;
        openPrice?: string | undefined;
        highPrice?: string | undefined;
        lowPrice?: string | undefined;
        volume?: string | undefined;
        quoteVolume?: string | undefined;
        openTime?: number | undefined;
        closeTime?: number | undefined;
        firstId?: number | undefined;
        lastId?: number | undefined;
        count?: number | undefined;
    }, {
        symbol: string;
        lastPrice: string;
        bidPrice: string;
        askPrice: string;
        priceChange?: string | undefined;
        priceChangePercent?: string | undefined;
        weightedAvgPrice?: string | undefined;
        prevClosePrice?: string | undefined;
        lastQty?: string | undefined;
        bidQty?: string | undefined;
        askQty?: string | undefined;
        openPrice?: string | undefined;
        highPrice?: string | undefined;
        lowPrice?: string | undefined;
        volume?: string | undefined;
        quoteVolume?: string | undefined;
        openTime?: number | undefined;
        closeTime?: number | undefined;
        firstId?: number | undefined;
        lastId?: number | undefined;
        count?: number | undefined;
    }>;
    avgPrice: z.ZodObject<{
        mins: z.ZodOptional<z.ZodNumber>;
        price: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        price: string;
        mins?: number | undefined;
    }, {
        price: string;
        mins?: number | undefined;
    }>;
    depth: z.ZodObject<{
        lastUpdateId: z.ZodNumber;
        bids: z.ZodArray<z.ZodTuple<[z.ZodString, z.ZodString], null>, "many">;
        asks: z.ZodArray<z.ZodTuple<[z.ZodString, z.ZodString], null>, "many">;
    }, "strip", z.ZodTypeAny, {
        lastUpdateId: number;
        bids: [string, string][];
        asks: [string, string][];
    }, {
        lastUpdateId: number;
        bids: [string, string][];
        asks: [string, string][];
    }>;
    trades: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        price: z.ZodString;
        qty: z.ZodString;
        quoteQty: z.ZodString;
        time: z.ZodNumber;
        isBuyerMaker: z.ZodBoolean;
        isBestMatch: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        price: string;
        id: number;
        qty: string;
        quoteQty: string;
        time: number;
        isBuyerMaker: boolean;
        isBestMatch: boolean;
    }, {
        price: string;
        id: number;
        qty: string;
        quoteQty: string;
        time: number;
        isBuyerMaker: boolean;
        isBestMatch: boolean;
    }>, "many">;
    aggTrades: z.ZodArray<z.ZodObject<{
        a: z.ZodNumber;
        p: z.ZodString;
        q: z.ZodString;
        f: z.ZodNumber;
        l: z.ZodNumber;
        T: z.ZodNumber;
        m: z.ZodBoolean;
        M: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        a: number;
        p: string;
        q: string;
        f: number;
        l: number;
        T: number;
        m: boolean;
        M: boolean;
    }, {
        a: number;
        p: string;
        q: string;
        f: number;
        l: number;
        T: number;
        m: boolean;
        M: boolean;
    }>, "many">;
    account: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        makerCommission: z.ZodOptional<z.ZodNumber>;
        takerCommission: z.ZodOptional<z.ZodNumber>;
        buyerCommission: z.ZodOptional<z.ZodNumber>;
        sellerCommission: z.ZodOptional<z.ZodNumber>;
        canTrade: z.ZodBoolean;
        canWithdraw: z.ZodBoolean;
        canDeposit: z.ZodBoolean;
        updateTime: z.ZodOptional<z.ZodNumber>;
        accountType: z.ZodOptional<z.ZodString>;
        balances: z.ZodOptional<z.ZodArray<z.ZodObject<{
            asset: z.ZodString;
            free: z.ZodString;
            locked: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            asset: string;
            free: string;
            locked: string;
        }, {
            asset: string;
            free: string;
            locked: string;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        status: string;
        canTrade: boolean;
        canWithdraw: boolean;
        canDeposit: boolean;
        message?: string | undefined;
        makerCommission?: number | undefined;
        takerCommission?: number | undefined;
        buyerCommission?: number | undefined;
        sellerCommission?: number | undefined;
        updateTime?: number | undefined;
        accountType?: string | undefined;
        balances?: {
            asset: string;
            free: string;
            locked: string;
        }[] | undefined;
    }, {
        status: string;
        canTrade: boolean;
        canWithdraw: boolean;
        canDeposit: boolean;
        message?: string | undefined;
        makerCommission?: number | undefined;
        takerCommission?: number | undefined;
        buyerCommission?: number | undefined;
        sellerCommission?: number | undefined;
        updateTime?: number | undefined;
        accountType?: string | undefined;
        balances?: {
            asset: string;
            free: string;
            locked: string;
        }[] | undefined;
    }>;
    capitalDepositAddress: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        coin: z.ZodOptional<z.ZodString>;
        address: z.ZodString;
        tag: z.ZodOptional<z.ZodString>;
        url: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        status: string;
        address: string;
        message?: string | undefined;
        coin?: string | undefined;
        tag?: string | undefined;
        url?: string | undefined;
    }, {
        status: string;
        address: string;
        message?: string | undefined;
        coin?: string | undefined;
        tag?: string | undefined;
        url?: string | undefined;
    }>;
    orderQuote: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        symbol: z.ZodOptional<z.ZodString>;
        price: z.ZodString;
        qty: z.ZodOptional<z.ZodString>;
        quoteQty: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        status: string;
        price: string;
        symbol?: string | undefined;
        message?: string | undefined;
        qty?: string | undefined;
        quoteQty?: string | undefined;
    }, {
        status: string;
        price: string;
        symbol?: string | undefined;
        message?: string | undefined;
        qty?: string | undefined;
        quoteQty?: string | undefined;
    }>;
    newOrder: z.ZodObject<{
        message: z.ZodOptional<z.ZodString>;
    } & {
        symbol: z.ZodString;
        orderId: z.ZodString;
        orderListId: z.ZodOptional<z.ZodNumber>;
        clientOrderId: z.ZodOptional<z.ZodString>;
        transactTime: z.ZodOptional<z.ZodNumber>;
        price: z.ZodString;
        origQty: z.ZodString;
        executedQty: z.ZodOptional<z.ZodString>;
        cummulativeQuoteQty: z.ZodOptional<z.ZodString>;
        status: z.ZodString;
        timeInForce: z.ZodOptional<z.ZodString>;
        type: z.ZodOptional<z.ZodString>;
        side: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        symbol: string;
        status: string;
        price: string;
        orderId: string;
        origQty: string;
        side: string;
        message?: string | undefined;
        type?: string | undefined;
        orderListId?: number | undefined;
        clientOrderId?: string | undefined;
        transactTime?: number | undefined;
        executedQty?: string | undefined;
        cummulativeQuoteQty?: string | undefined;
        timeInForce?: string | undefined;
    }, {
        symbol: string;
        status: string;
        price: string;
        orderId: string;
        origQty: string;
        side: string;
        message?: string | undefined;
        type?: string | undefined;
        orderListId?: number | undefined;
        clientOrderId?: string | undefined;
        transactTime?: number | undefined;
        executedQty?: string | undefined;
        cummulativeQuoteQty?: string | undefined;
        timeInForce?: string | undefined;
    }>;
    orderUpdateBuy: z.ZodObject<{
        message: z.ZodOptional<z.ZodString>;
    } & {
        symbol: z.ZodString;
        orderId: z.ZodString;
        orderListId: z.ZodOptional<z.ZodNumber>;
        clientOrderId: z.ZodOptional<z.ZodString>;
        price: z.ZodString;
        origQty: z.ZodString;
        executedQty: z.ZodOptional<z.ZodString>;
        cummulativeQuoteQty: z.ZodOptional<z.ZodString>;
        status: z.ZodString;
        timeInForce: z.ZodOptional<z.ZodString>;
        type: z.ZodOptional<z.ZodString>;
        side: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        symbol: string;
        status: string;
        price: string;
        orderId: string;
        origQty: string;
        side: string;
        message?: string | undefined;
        type?: string | undefined;
        orderListId?: number | undefined;
        clientOrderId?: string | undefined;
        executedQty?: string | undefined;
        cummulativeQuoteQty?: string | undefined;
        timeInForce?: string | undefined;
    }, {
        symbol: string;
        status: string;
        price: string;
        orderId: string;
        origQty: string;
        side: string;
        message?: string | undefined;
        type?: string | undefined;
        orderListId?: number | undefined;
        clientOrderId?: string | undefined;
        executedQty?: string | undefined;
        cummulativeQuoteQty?: string | undefined;
        timeInForce?: string | undefined;
    }>;
    orderUpdateSell: z.ZodObject<{
        message: z.ZodOptional<z.ZodString>;
    } & {
        symbol: z.ZodString;
        orderId: z.ZodString;
        orderListId: z.ZodOptional<z.ZodNumber>;
        clientOrderId: z.ZodOptional<z.ZodString>;
        price: z.ZodString;
        origQty: z.ZodString;
        executedQty: z.ZodOptional<z.ZodString>;
        cummulativeQuoteQty: z.ZodOptional<z.ZodString>;
        status: z.ZodString;
        timeInForce: z.ZodOptional<z.ZodString>;
        type: z.ZodOptional<z.ZodString>;
        side: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        symbol: string;
        status: string;
        price: string;
        orderId: string;
        origQty: string;
        side: string;
        message?: string | undefined;
        type?: string | undefined;
        orderListId?: number | undefined;
        clientOrderId?: string | undefined;
        executedQty?: string | undefined;
        cummulativeQuoteQty?: string | undefined;
        timeInForce?: string | undefined;
    }, {
        symbol: string;
        status: string;
        price: string;
        orderId: string;
        origQty: string;
        side: string;
        message?: string | undefined;
        type?: string | undefined;
        orderListId?: number | undefined;
        clientOrderId?: string | undefined;
        executedQty?: string | undefined;
        cummulativeQuoteQty?: string | undefined;
        timeInForce?: string | undefined;
    }>;
    marketBuyExecution: z.ZodObject<{
        message: z.ZodOptional<z.ZodString>;
    } & {
        symbol: z.ZodString;
        orderId: z.ZodOptional<z.ZodString>;
        orderListId: z.ZodOptional<z.ZodNumber>;
        clientOrderId: z.ZodOptional<z.ZodString>;
        transactTime: z.ZodOptional<z.ZodNumber>;
        price: z.ZodString;
        origQty: z.ZodString;
        executedQty: z.ZodString;
        cummulativeQuoteQty: z.ZodString;
        status: z.ZodString;
        timeInForce: z.ZodOptional<z.ZodString>;
        type: z.ZodOptional<z.ZodString>;
        side: z.ZodString;
        fills: z.ZodOptional<z.ZodArray<z.ZodObject<{
            price: z.ZodString;
            qty: z.ZodString;
            commission: z.ZodOptional<z.ZodString>;
            commissionAsset: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            price: string;
            qty: string;
            commission?: string | undefined;
            commissionAsset?: string | undefined;
        }, {
            price: string;
            qty: string;
            commission?: string | undefined;
            commissionAsset?: string | undefined;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        symbol: string;
        status: string;
        price: string;
        origQty: string;
        executedQty: string;
        cummulativeQuoteQty: string;
        side: string;
        message?: string | undefined;
        type?: string | undefined;
        orderId?: string | undefined;
        orderListId?: number | undefined;
        clientOrderId?: string | undefined;
        transactTime?: number | undefined;
        timeInForce?: string | undefined;
        fills?: {
            price: string;
            qty: string;
            commission?: string | undefined;
            commissionAsset?: string | undefined;
        }[] | undefined;
    }, {
        symbol: string;
        status: string;
        price: string;
        origQty: string;
        executedQty: string;
        cummulativeQuoteQty: string;
        side: string;
        message?: string | undefined;
        type?: string | undefined;
        orderId?: string | undefined;
        orderListId?: number | undefined;
        clientOrderId?: string | undefined;
        transactTime?: number | undefined;
        timeInForce?: string | undefined;
        fills?: {
            price: string;
            qty: string;
            commission?: string | undefined;
            commissionAsset?: string | undefined;
        }[] | undefined;
    }>;
    marketSellExecution: z.ZodObject<{
        message: z.ZodOptional<z.ZodString>;
    } & {
        symbol: z.ZodString;
        orderId: z.ZodOptional<z.ZodString>;
        orderListId: z.ZodOptional<z.ZodNumber>;
        clientOrderId: z.ZodOptional<z.ZodString>;
        transactTime: z.ZodOptional<z.ZodNumber>;
        price: z.ZodString;
        origQty: z.ZodString;
        executedQty: z.ZodString;
        cummulativeQuoteQty: z.ZodString;
        status: z.ZodString;
        timeInForce: z.ZodOptional<z.ZodString>;
        type: z.ZodOptional<z.ZodString>;
        side: z.ZodString;
        fills: z.ZodOptional<z.ZodArray<z.ZodObject<{
            price: z.ZodString;
            qty: z.ZodString;
            commission: z.ZodOptional<z.ZodString>;
            commissionAsset: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            price: string;
            qty: string;
            commission?: string | undefined;
            commissionAsset?: string | undefined;
        }, {
            price: string;
            qty: string;
            commission?: string | undefined;
            commissionAsset?: string | undefined;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        symbol: string;
        status: string;
        price: string;
        origQty: string;
        executedQty: string;
        cummulativeQuoteQty: string;
        side: string;
        message?: string | undefined;
        type?: string | undefined;
        orderId?: string | undefined;
        orderListId?: number | undefined;
        clientOrderId?: string | undefined;
        transactTime?: number | undefined;
        timeInForce?: string | undefined;
        fills?: {
            price: string;
            qty: string;
            commission?: string | undefined;
            commissionAsset?: string | undefined;
        }[] | undefined;
    }, {
        symbol: string;
        status: string;
        price: string;
        origQty: string;
        executedQty: string;
        cummulativeQuoteQty: string;
        side: string;
        message?: string | undefined;
        type?: string | undefined;
        orderId?: string | undefined;
        orderListId?: number | undefined;
        clientOrderId?: string | undefined;
        transactTime?: number | undefined;
        timeInForce?: string | undefined;
        fills?: {
            price: string;
            qty: string;
            commission?: string | undefined;
            commissionAsset?: string | undefined;
        }[] | undefined;
    }>;
    marketSwapExecution: z.ZodObject<{
        message: z.ZodOptional<z.ZodString>;
    } & {
        symbol: z.ZodString;
        orderId: z.ZodOptional<z.ZodString>;
        orderListId: z.ZodOptional<z.ZodNumber>;
        clientOrderId: z.ZodOptional<z.ZodString>;
        transactTime: z.ZodOptional<z.ZodNumber>;
        price: z.ZodString;
        origQty: z.ZodString;
        executedQty: z.ZodString;
        cummulativeQuoteQty: z.ZodString;
        status: z.ZodString;
        timeInForce: z.ZodOptional<z.ZodString>;
        type: z.ZodOptional<z.ZodString>;
        side: z.ZodString;
        fills: z.ZodOptional<z.ZodArray<z.ZodObject<{
            price: z.ZodString;
            qty: z.ZodString;
            commission: z.ZodOptional<z.ZodString>;
            commissionAsset: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            price: string;
            qty: string;
            commission?: string | undefined;
            commissionAsset?: string | undefined;
        }, {
            price: string;
            qty: string;
            commission?: string | undefined;
            commissionAsset?: string | undefined;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        symbol: string;
        status: string;
        price: string;
        origQty: string;
        executedQty: string;
        cummulativeQuoteQty: string;
        side: string;
        message?: string | undefined;
        type?: string | undefined;
        orderId?: string | undefined;
        orderListId?: number | undefined;
        clientOrderId?: string | undefined;
        transactTime?: number | undefined;
        timeInForce?: string | undefined;
        fills?: {
            price: string;
            qty: string;
            commission?: string | undefined;
            commissionAsset?: string | undefined;
        }[] | undefined;
    }, {
        symbol: string;
        status: string;
        price: string;
        origQty: string;
        executedQty: string;
        cummulativeQuoteQty: string;
        side: string;
        message?: string | undefined;
        type?: string | undefined;
        orderId?: string | undefined;
        orderListId?: number | undefined;
        clientOrderId?: string | undefined;
        transactTime?: number | undefined;
        timeInForce?: string | undefined;
        fills?: {
            price: string;
            qty: string;
            commission?: string | undefined;
            commissionAsset?: string | undefined;
        }[] | undefined;
    }>;
    cancelOrder: z.ZodObject<{
        message: z.ZodOptional<z.ZodString>;
    } & {
        symbol: z.ZodOptional<z.ZodString>;
        origClientOrderId: z.ZodOptional<z.ZodString>;
        orderId: z.ZodOptional<z.ZodString>;
        orderListId: z.ZodOptional<z.ZodNumber>;
        clientOrderId: z.ZodOptional<z.ZodString>;
        price: z.ZodOptional<z.ZodString>;
        origQty: z.ZodOptional<z.ZodString>;
        executedQty: z.ZodOptional<z.ZodString>;
        cummulativeQuoteQty: z.ZodOptional<z.ZodString>;
        status: z.ZodString;
        timeInForce: z.ZodOptional<z.ZodString>;
        type: z.ZodOptional<z.ZodString>;
        side: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        status: string;
        symbol?: string | undefined;
        message?: string | undefined;
        type?: string | undefined;
        price?: string | undefined;
        orderId?: string | undefined;
        orderListId?: number | undefined;
        clientOrderId?: string | undefined;
        origQty?: string | undefined;
        executedQty?: string | undefined;
        cummulativeQuoteQty?: string | undefined;
        timeInForce?: string | undefined;
        side?: string | undefined;
        origClientOrderId?: string | undefined;
    }, {
        status: string;
        symbol?: string | undefined;
        message?: string | undefined;
        type?: string | undefined;
        price?: string | undefined;
        orderId?: string | undefined;
        orderListId?: number | undefined;
        clientOrderId?: string | undefined;
        origQty?: string | undefined;
        executedQty?: string | undefined;
        cummulativeQuoteQty?: string | undefined;
        timeInForce?: string | undefined;
        side?: string | undefined;
        origClientOrderId?: string | undefined;
    }>;
    withdrawDetails: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        coin: z.ZodOptional<z.ZodString>;
        minAmount: z.ZodOptional<z.ZodString>;
        unlockConfirm: z.ZodOptional<z.ZodNumber>;
        withdrawFee: z.ZodOptional<z.ZodString>;
        withdrawMin: z.ZodOptional<z.ZodString>;
        withdrawMax: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        status: string;
        message?: string | undefined;
        coin?: string | undefined;
        minAmount?: string | undefined;
        unlockConfirm?: number | undefined;
        withdrawFee?: string | undefined;
        withdrawMin?: string | undefined;
        withdrawMax?: string | undefined;
    }, {
        status: string;
        message?: string | undefined;
        coin?: string | undefined;
        minAmount?: string | undefined;
        unlockConfirm?: number | undefined;
        withdrawFee?: string | undefined;
        withdrawMin?: string | undefined;
        withdrawMax?: string | undefined;
    }>;
    withdraw: z.ZodObject<{
        status: z.ZodString;
    } & {
        message: z.ZodOptional<z.ZodString>;
    } & {
        id: z.ZodString;
        coin: z.ZodOptional<z.ZodString>;
        amount: z.ZodOptional<z.ZodString>;
        transactionFee: z.ZodOptional<z.ZodString>;
        address: z.ZodOptional<z.ZodString>;
        addressTag: z.ZodOptional<z.ZodString>;
        txId: z.ZodOptional<z.ZodString>;
        applyTime: z.ZodOptional<z.ZodString>;
        network: z.ZodOptional<z.ZodString>;
        transferType: z.ZodOptional<z.ZodNumber>;
        withdrawOrderId: z.ZodOptional<z.ZodString>;
        info: z.ZodOptional<z.ZodString>;
        confirmNo: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        status: string;
        id: string;
        message?: string | undefined;
        coin?: string | undefined;
        address?: string | undefined;
        amount?: string | undefined;
        transactionFee?: string | undefined;
        addressTag?: string | undefined;
        txId?: string | undefined;
        applyTime?: string | undefined;
        network?: string | undefined;
        transferType?: number | undefined;
        withdrawOrderId?: string | undefined;
        info?: string | undefined;
        confirmNo?: number | undefined;
    }, {
        status: string;
        id: string;
        message?: string | undefined;
        coin?: string | undefined;
        address?: string | undefined;
        amount?: string | undefined;
        transactionFee?: string | undefined;
        addressTag?: string | undefined;
        txId?: string | undefined;
        applyTime?: string | undefined;
        network?: string | undefined;
        transferType?: number | undefined;
        withdrawOrderId?: string | undefined;
        info?: string | undefined;
        confirmNo?: number | undefined;
    }>;
    marketDepth: z.ZodObject<{
        lastUpdateId: z.ZodNumber;
        bids: z.ZodArray<z.ZodTuple<[z.ZodString, z.ZodString], null>, "many">;
        asks: z.ZodArray<z.ZodTuple<[z.ZodString, z.ZodString], null>, "many">;
    }, "strip", z.ZodTypeAny, {
        lastUpdateId: number;
        bids: [string, string][];
        asks: [string, string][];
    }, {
        lastUpdateId: number;
        bids: [string, string][];
        asks: [string, string][];
    }>;
    marketTradesWithFees: z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodNumber>;
        price: z.ZodString;
        qty: z.ZodString;
        quoteQty: z.ZodString;
        time: z.ZodNumber;
        commission: z.ZodOptional<z.ZodString>;
        commissionAsset: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        price: string;
        qty: string;
        quoteQty: string;
        time: number;
        id?: number | undefined;
        commission?: string | undefined;
        commissionAsset?: string | undefined;
    }, {
        price: string;
        qty: string;
        quoteQty: string;
        time: number;
        id?: number | undefined;
        commission?: string | undefined;
        commissionAsset?: string | undefined;
    }>, "many">;
    accountBalances: z.ZodObject<{
        balances: z.ZodArray<z.ZodObject<{
            asset: z.ZodString;
            free: z.ZodString;
            locked: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            asset: string;
            free: string;
            locked: string;
        }, {
            asset: string;
            free: string;
            locked: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        balances: {
            asset: string;
            free: string;
            locked: string;
        }[];
    }, {
        balances: {
            asset: string;
            free: string;
            locked: string;
        }[];
    }>;
    assetBalance: z.ZodObject<{
        asset: z.ZodString;
        free: z.ZodString;
        locked: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        asset: string;
        free: string;
        locked: string;
    }, {
        asset: string;
        free: string;
        locked: string;
    }>;
    openMarketOrders: z.ZodArray<z.ZodObject<{
        symbol: z.ZodString;
        orderId: z.ZodString;
        orderListId: z.ZodOptional<z.ZodNumber>;
        clientOrderId: z.ZodOptional<z.ZodString>;
        price: z.ZodString;
        origQty: z.ZodString;
        executedQty: z.ZodOptional<z.ZodString>;
        cummulativeQuoteQty: z.ZodOptional<z.ZodString>;
        status: z.ZodString;
        timeInForce: z.ZodOptional<z.ZodString>;
        type: z.ZodString;
        side: z.ZodString;
        stopPrice: z.ZodOptional<z.ZodString>;
        icebergQty: z.ZodOptional<z.ZodString>;
        time: z.ZodNumber;
        updateTime: z.ZodOptional<z.ZodNumber>;
        isWorking: z.ZodOptional<z.ZodBoolean>;
        origQuoteOrderQty: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        symbol: string;
        status: string;
        type: string;
        price: string;
        time: number;
        orderId: string;
        origQty: string;
        side: string;
        updateTime?: number | undefined;
        orderListId?: number | undefined;
        clientOrderId?: string | undefined;
        executedQty?: string | undefined;
        cummulativeQuoteQty?: string | undefined;
        timeInForce?: string | undefined;
        stopPrice?: string | undefined;
        icebergQty?: string | undefined;
        isWorking?: boolean | undefined;
        origQuoteOrderQty?: string | undefined;
    }, {
        symbol: string;
        status: string;
        type: string;
        price: string;
        time: number;
        orderId: string;
        origQty: string;
        side: string;
        updateTime?: number | undefined;
        orderListId?: number | undefined;
        clientOrderId?: string | undefined;
        executedQty?: string | undefined;
        cummulativeQuoteQty?: string | undefined;
        timeInForce?: string | undefined;
        stopPrice?: string | undefined;
        icebergQty?: string | undefined;
        isWorking?: boolean | undefined;
        origQuoteOrderQty?: string | undefined;
    }>, "many">;
    openLimitOrders: z.ZodArray<z.ZodObject<{
        symbol: z.ZodString;
        orderId: z.ZodString;
        orderListId: z.ZodOptional<z.ZodNumber>;
        clientOrderId: z.ZodOptional<z.ZodString>;
        price: z.ZodString;
        origQty: z.ZodString;
        executedQty: z.ZodOptional<z.ZodString>;
        cummulativeQuoteQty: z.ZodOptional<z.ZodString>;
        status: z.ZodString;
        timeInForce: z.ZodOptional<z.ZodString>;
        type: z.ZodString;
        side: z.ZodString;
        stopPrice: z.ZodOptional<z.ZodString>;
        icebergQty: z.ZodOptional<z.ZodString>;
        time: z.ZodNumber;
        updateTime: z.ZodOptional<z.ZodNumber>;
        isWorking: z.ZodOptional<z.ZodBoolean>;
        origQuoteOrderQty: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        symbol: string;
        status: string;
        type: string;
        price: string;
        time: number;
        orderId: string;
        origQty: string;
        side: string;
        updateTime?: number | undefined;
        orderListId?: number | undefined;
        clientOrderId?: string | undefined;
        executedQty?: string | undefined;
        cummulativeQuoteQty?: string | undefined;
        timeInForce?: string | undefined;
        stopPrice?: string | undefined;
        icebergQty?: string | undefined;
        isWorking?: boolean | undefined;
        origQuoteOrderQty?: string | undefined;
    }, {
        symbol: string;
        status: string;
        type: string;
        price: string;
        time: number;
        orderId: string;
        origQty: string;
        side: string;
        updateTime?: number | undefined;
        orderListId?: number | undefined;
        clientOrderId?: string | undefined;
        executedQty?: string | undefined;
        cummulativeQuoteQty?: string | undefined;
        timeInForce?: string | undefined;
        stopPrice?: string | undefined;
        icebergQty?: string | undefined;
        isWorking?: boolean | undefined;
        origQuoteOrderQty?: string | undefined;
    }>, "many">;
    allOrders: z.ZodArray<z.ZodObject<{
        symbol: z.ZodString;
        orderId: z.ZodString;
        orderListId: z.ZodOptional<z.ZodNumber>;
        clientOrderId: z.ZodOptional<z.ZodString>;
        price: z.ZodString;
        origQty: z.ZodString;
        executedQty: z.ZodOptional<z.ZodString>;
        cummulativeQuoteQty: z.ZodOptional<z.ZodString>;
        status: z.ZodString;
        timeInForce: z.ZodOptional<z.ZodString>;
        type: z.ZodString;
        side: z.ZodString;
        stopPrice: z.ZodOptional<z.ZodString>;
        icebergQty: z.ZodOptional<z.ZodString>;
        time: z.ZodNumber;
        updateTime: z.ZodOptional<z.ZodNumber>;
        isWorking: z.ZodOptional<z.ZodBoolean>;
        origQuoteOrderQty: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        symbol: string;
        status: string;
        type: string;
        price: string;
        time: number;
        orderId: string;
        origQty: string;
        side: string;
        updateTime?: number | undefined;
        orderListId?: number | undefined;
        clientOrderId?: string | undefined;
        executedQty?: string | undefined;
        cummulativeQuoteQty?: string | undefined;
        timeInForce?: string | undefined;
        stopPrice?: string | undefined;
        icebergQty?: string | undefined;
        isWorking?: boolean | undefined;
        origQuoteOrderQty?: string | undefined;
    }, {
        symbol: string;
        status: string;
        type: string;
        price: string;
        time: number;
        orderId: string;
        origQty: string;
        side: string;
        updateTime?: number | undefined;
        orderListId?: number | undefined;
        clientOrderId?: string | undefined;
        executedQty?: string | undefined;
        cummulativeQuoteQty?: string | undefined;
        timeInForce?: string | undefined;
        stopPrice?: string | undefined;
        icebergQty?: string | undefined;
        isWorking?: boolean | undefined;
        origQuoteOrderQty?: string | undefined;
    }>, "many">;
    allMarketOrders: z.ZodArray<z.ZodObject<{
        symbol: z.ZodString;
        orderId: z.ZodString;
        orderListId: z.ZodOptional<z.ZodNumber>;
        clientOrderId: z.ZodOptional<z.ZodString>;
        price: z.ZodString;
        origQty: z.ZodString;
        executedQty: z.ZodOptional<z.ZodString>;
        cummulativeQuoteQty: z.ZodOptional<z.ZodString>;
        status: z.ZodString;
        timeInForce: z.ZodOptional<z.ZodString>;
        type: z.ZodString;
        side: z.ZodString;
        stopPrice: z.ZodOptional<z.ZodString>;
        icebergQty: z.ZodOptional<z.ZodString>;
        time: z.ZodNumber;
        updateTime: z.ZodOptional<z.ZodNumber>;
        isWorking: z.ZodOptional<z.ZodBoolean>;
        origQuoteOrderQty: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        symbol: string;
        status: string;
        type: string;
        price: string;
        time: number;
        orderId: string;
        origQty: string;
        side: string;
        updateTime?: number | undefined;
        orderListId?: number | undefined;
        clientOrderId?: string | undefined;
        executedQty?: string | undefined;
        cummulativeQuoteQty?: string | undefined;
        timeInForce?: string | undefined;
        stopPrice?: string | undefined;
        icebergQty?: string | undefined;
        isWorking?: boolean | undefined;
        origQuoteOrderQty?: string | undefined;
    }, {
        symbol: string;
        status: string;
        type: string;
        price: string;
        time: number;
        orderId: string;
        origQty: string;
        side: string;
        updateTime?: number | undefined;
        orderListId?: number | undefined;
        clientOrderId?: string | undefined;
        executedQty?: string | undefined;
        cummulativeQuoteQty?: string | undefined;
        timeInForce?: string | undefined;
        stopPrice?: string | undefined;
        icebergQty?: string | undefined;
        isWorking?: boolean | undefined;
        origQuoteOrderQty?: string | undefined;
    }>, "many">;
    transferHistory: z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodNumber>;
        asset: z.ZodString;
        amount: z.ZodString;
        type: z.ZodString;
        status: z.ZodString;
        tranId: z.ZodOptional<z.ZodNumber>;
        timestamp: z.ZodNumber;
        address: z.ZodOptional<z.ZodString>;
        addressTag: z.ZodOptional<z.ZodString>;
        txId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        status: string;
        type: string;
        asset: string;
        amount: string;
        timestamp: number;
        id?: number | undefined;
        address?: string | undefined;
        addressTag?: string | undefined;
        txId?: string | undefined;
        tranId?: number | undefined;
    }, {
        status: string;
        type: string;
        asset: string;
        amount: string;
        timestamp: number;
        id?: number | undefined;
        address?: string | undefined;
        addressTag?: string | undefined;
        txId?: string | undefined;
        tranId?: number | undefined;
    }>, "many">;
    fiatDepositHistory: z.ZodArray<z.ZodObject<{
        orderNo: z.ZodOptional<z.ZodString>;
        fiatCurrency: z.ZodOptional<z.ZodString>;
        indicatedAmount: z.ZodString;
        amount: z.ZodString;
        totalFee: z.ZodOptional<z.ZodString>;
        method: z.ZodOptional<z.ZodString>;
        status: z.ZodString;
        createTime: z.ZodOptional<z.ZodNumber>;
        updateTime: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        status: string;
        amount: string;
        indicatedAmount: string;
        updateTime?: number | undefined;
        orderNo?: string | undefined;
        fiatCurrency?: string | undefined;
        totalFee?: string | undefined;
        method?: string | undefined;
        createTime?: number | undefined;
    }, {
        status: string;
        amount: string;
        indicatedAmount: string;
        updateTime?: number | undefined;
        orderNo?: string | undefined;
        fiatCurrency?: string | undefined;
        totalFee?: string | undefined;
        method?: string | undefined;
        createTime?: number | undefined;
    }>, "many">;
    fiatWithdrawalHistory: z.ZodArray<z.ZodObject<{
        orderNo: z.ZodOptional<z.ZodString>;
        fiatCurrency: z.ZodOptional<z.ZodString>;
        indicatedAmount: z.ZodString;
        amount: z.ZodString;
        totalFee: z.ZodOptional<z.ZodString>;
        method: z.ZodOptional<z.ZodString>;
        status: z.ZodString;
        createTime: z.ZodOptional<z.ZodNumber>;
        updateTime: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        status: string;
        amount: string;
        indicatedAmount: string;
        updateTime?: number | undefined;
        orderNo?: string | undefined;
        fiatCurrency?: string | undefined;
        totalFee?: string | undefined;
        method?: string | undefined;
        createTime?: number | undefined;
    }, {
        status: string;
        amount: string;
        indicatedAmount: string;
        updateTime?: number | undefined;
        orderNo?: string | undefined;
        fiatCurrency?: string | undefined;
        totalFee?: string | undefined;
        method?: string | undefined;
        createTime?: number | undefined;
    }>, "many">;
    affiliatePayments: z.ZodArray<z.ZodObject<{
        amount: z.ZodString;
        asset: z.ZodOptional<z.ZodString>;
        time: z.ZodOptional<z.ZodNumber>;
        month: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        amount: string;
        time?: number | undefined;
        asset?: string | undefined;
        month?: string | undefined;
    }, {
        amount: string;
        time?: number | undefined;
        asset?: string | undefined;
        month?: string | undefined;
    }>, "many">;
    referralPayments: z.ZodArray<z.ZodObject<{
        userId: z.ZodOptional<z.ZodString>;
        registerTime: z.ZodOptional<z.ZodNumber>;
        amount: z.ZodString;
        asset: z.ZodString;
        time: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        time: number;
        asset: string;
        amount: string;
        userId?: string | undefined;
        registerTime?: number | undefined;
    }, {
        time: number;
        asset: string;
        amount: string;
        userId?: string | undefined;
        registerTime?: number | undefined;
    }>, "many">;
    symbolsChart: z.ZodArray<z.ZodObject<{
        symbol: z.ZodString;
        status: z.ZodOptional<z.ZodString>;
        baseAsset: z.ZodOptional<z.ZodString>;
        baseAssetPrecision: z.ZodOptional<z.ZodNumber>;
        quoteAsset: z.ZodOptional<z.ZodString>;
        quotePrecision: z.ZodOptional<z.ZodNumber>;
        quoteAssetPrecision: z.ZodOptional<z.ZodNumber>;
        orderTypes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        icebergAllowed: z.ZodOptional<z.ZodBoolean>;
        ocoAllowed: z.ZodOptional<z.ZodBoolean>;
        isSpotTradingAllowed: z.ZodOptional<z.ZodBoolean>;
        isMarginTradingAllowed: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        symbol: string;
        status?: string | undefined;
        baseAsset?: string | undefined;
        baseAssetPrecision?: number | undefined;
        quoteAsset?: string | undefined;
        quotePrecision?: number | undefined;
        quoteAssetPrecision?: number | undefined;
        orderTypes?: string[] | undefined;
        icebergAllowed?: boolean | undefined;
        ocoAllowed?: boolean | undefined;
        isSpotTradingAllowed?: boolean | undefined;
        isMarginTradingAllowed?: boolean | undefined;
    }, {
        symbol: string;
        status?: string | undefined;
        baseAsset?: string | undefined;
        baseAssetPrecision?: number | undefined;
        quoteAsset?: string | undefined;
        quotePrecision?: number | undefined;
        quoteAssetPrecision?: number | undefined;
        orderTypes?: string[] | undefined;
        icebergAllowed?: boolean | undefined;
        ocoAllowed?: boolean | undefined;
        isSpotTradingAllowed?: boolean | undefined;
        isMarginTradingAllowed?: boolean | undefined;
    }>, "many">;
    latestPriceChart: z.ZodObject<{
        symbol: z.ZodString;
        price: z.ZodString;
        time: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        symbol: string;
        price: string;
        time?: number | undefined;
    }, {
        symbol: string;
        price: string;
        time?: number | undefined;
    }>;
};
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
