#!/usr/bin/env tsx
"use strict";
/**
 * Get open market orders
 * Endpoint: POST /api/v2/ro/my/orders/market/open
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
    console.log(`Fetching open market orders${cointype ? ` for ${cointype}` : ''}${markettype ? `/${markettype}` : ''}...\n`);
    const result = await client.readOnly.openMarketOrders({ cointype, markettype });
    console.log(`Result: ${result.length} open orders`);
    if (result.length > 0) {
        console.log('\nOpen orders:');
        result.forEach(order => {
            const date = new Date(order.time).toISOString();
            console.log(`  [${order.orderId}] ${order.symbol}: ${order.side} ${order.origQty} @ ${order.price} (${order.status}) - ${date}`);
        });
    }
}
main().catch(console.error);
