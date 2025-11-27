#!/usr/bin/env tsx
"use strict";
/**
 * Get quote for buying
 * Endpoint: POST /api/v2/quote/buy/now
 * Requires: Full Access API key
 */
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../index");
async function main() {
    const client = new index_1.CoinspotClient({
        fullAccess: {
            key: process.env.COINSPOT_KEY,
            secret: process.env.COINSPOT_SECRET,
        },
    });
    const cointype = process.argv[2] || 'BTC';
    const amount = parseFloat(process.argv[3] || '100');
    const amounttype = (process.argv[4] || 'aud');
    console.log(`Getting buy quote for ${amount} ${amounttype} of ${cointype}...\n`);
    const result = await client.fullAccess.orderQuoteBuy(cointype, amount, amounttype);
    console.log('Result:');
    console.log(`  Status: ${result.status}`);
    console.log(`  Price: ${result.price}`);
    console.log(`  Message: ${result.message || 'N/A'}`);
}
main().catch(console.error);
