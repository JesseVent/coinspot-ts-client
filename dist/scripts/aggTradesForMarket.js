#!/usr/bin/env tsx
"use strict";
/**
 * Get aggregated trade summary for a symbol/quote market pair
 * Endpoint: GET /pubapi/v2/orders/completed/{cointype}/{markettype}
 */
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
async function main() {
    const client = new index_1.CoinspotClient();
    const symbol = process.argv[2] || 'BTC';
    const quote = process.argv[3] || 'USDT';
    console.log(`Fetching aggregated trades for ${symbol}/${quote}...\n`);
    const result = await client.public.aggTradesForMarket(symbol, quote);
    console.log(`Result: ${result.length} aggregated trades`);
    if (result.length > 0) {
        console.log('\nMost recent 5 aggregated trades:');
        result.slice(0, 5).forEach(trade => {
            const date = new Date(trade.T).toISOString();
            console.log(`  ${date}: ${trade.q} @ ${trade.p} (agg ID: ${trade.a})`);
        });
    }
}
main().catch(console.error);
