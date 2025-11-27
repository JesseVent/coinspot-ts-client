#!/usr/bin/env tsx
"use strict";
/**
 * Get 24-hour price change statistics for all markets
 * Endpoint: GET /pubapi/v2/latest
 */
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
async function main() {
    const client = new index_1.CoinspotClient();
    console.log('Fetching 24hr ticker for all markets...\n');
    const result = await client.public.ticker24hr();
    console.log(`Received ${result.length} markets`);
    console.log('\nSample (first 3):');
    result.slice(0, 3).forEach(ticker => {
        console.log(`  ${ticker.symbol}: last=${ticker.lastPrice}, bid=${ticker.bidPrice}, ask=${ticker.askPrice}`);
    });
}
main().catch(console.error);
