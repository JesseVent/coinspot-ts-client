#!/usr/bin/env tsx
"use strict";
/**
 * Get all historical orders
 * Endpoint: POST /api/v2/ro/my/orders/completed
 * Requires: Read-Only API key
 */
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../index");
async function main() {
    const client = new index_1.CoinspotClient({
        readOnly: {
            key: process.env.COINSPOT_RO_KEY,
            secret: process.env.COINSPOT_RO_SECRET,
        },
    });
    const cointype = process.argv[2];
    const markettype = process.argv[3];
    const limit = process.argv[4] ? parseInt(process.argv[4]) : undefined;
    console.log(`Fetching historical orders${cointype ? ` for ${cointype}` : ''}${markettype ? `/${markettype}` : ''}${limit ? ` (limit: ${limit})` : ''}...\n`);
    const result = await client.readOnly.allOrders({ cointype, markettype, limit });
    console.log(`Result: ${result.length} orders`);
    if (result.length > 0) {
        console.log('\nMost recent 10 orders:');
        result.slice(0, 10).forEach(order => {
            const date = new Date(order.time).toISOString();
            console.log(`  ${order.symbol}: ${order.side} ${order.origQty} @ ${order.price} (${order.status}) - ${date}`);
        });
    }
}
main().catch(console.error);
