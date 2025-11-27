#!/usr/bin/env tsx
"use strict";
/**
 * Get average price for a symbol (using buy price)
 * Endpoint: GET /pubapi/v2/buyprice/{cointype}
 */
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
async function main() {
    const client = new index_1.CoinspotClient();
    const symbol = process.argv[2] || 'BTC';
    console.log(`Fetching average buy price for ${symbol}...\n`);
    const result = await client.public.avgPrice(symbol);
    console.log('Result:');
    console.log(`  Price: ${result.price}`);
}
main().catch(console.error);
