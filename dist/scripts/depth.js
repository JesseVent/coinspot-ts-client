#!/usr/bin/env tsx
"use strict";
/**
 * Get order book depth for AUD market
 * Endpoint: GET /pubapi/v2/orders/open/{cointype}
 */
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
async function main() {
    const client = new index_1.CoinspotClient();
    const symbol = process.argv[2] || 'BTC';
    console.log(`Fetching order book depth for ${symbol}...\n`);
    const result = await client.public.depth(symbol);
    console.log('Result:');
    console.log(`  Last Update ID: ${result.lastUpdateId}`);
    console.log(`  Bids: ${result.bids.length} levels`);
    console.log(`  Asks: ${result.asks.length} levels`);
    if (result.bids.length > 0) {
        console.log(`\n  Top 3 Bids:`);
        result.bids.slice(0, 3).forEach(([price, qty]) => {
            console.log(`    ${price} @ ${qty}`);
        });
    }
    if (result.asks.length > 0) {
        console.log(`\n  Top 3 Asks:`);
        result.asks.slice(0, 3).forEach(([price, qty]) => {
            console.log(`    ${price} @ ${qty}`);
        });
    }
}
main().catch(console.error);
