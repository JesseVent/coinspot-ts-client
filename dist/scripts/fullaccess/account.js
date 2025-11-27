#!/usr/bin/env tsx
"use strict";
/**
 * Get account status and information
 * Endpoint: POST /api/v2/status
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
    console.log('Fetching account status...\n');
    const result = await client.fullAccess.account();
    console.log('Result:');
    console.log(`  Status: ${result.status}`);
    console.log(`  Message: ${result.message || 'N/A'}`);
    console.log(`  Can Trade: ${result.canTrade}`);
    console.log(`  Can Withdraw: ${result.canWithdraw}`);
    console.log(`  Can Deposit: ${result.canDeposit}`);
}
main().catch(console.error);
