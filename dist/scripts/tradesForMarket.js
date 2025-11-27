#!/usr/bin/env tsx
"use strict";
/**
 * Get recent trades for a symbol/quote market pair
 * Endpoint: GET /pubapi/v2/orders/completed/{cointype}/{markettype}
 */
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
async function main() {
    const client = new index_1.CoinspotClient();
    const symbol = process.argv[2] || 'BTC';
    const quote = process.argv[3] || 'USDT';
    console.log(`Fetching recent trades for ${symbol}/${quote}...\n`);
    const result = await client.public.tradesForMarket(symbol, quote);
    console.log(`Result: ${result.length} trades`);
    if (result.length > 0) {
        console.log('\nMost recent 5 trades:');
        result.slice(0, 5).forEach(trade => {
            const date = new Date(trade.time).toISOString();
            console.log(`  ${date}: ${trade.qty} @ ${trade.price} (${trade.isBuyerMaker ? 'sell' : 'buy'})`);
        });
    }
}
main().catch(console.error);
