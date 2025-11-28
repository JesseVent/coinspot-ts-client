#!/usr/bin/env tsx
/**
 * Cancel a buy order
 * Endpoint: POST /api/v2/my/buy/cancel
 * Requires: Full Access API key
 */

import { CoinspotClient } from "../../index";

async function main() {
  const client = new CoinspotClient({
    fullAccess: {
      key: process.env.COINSPOT_KEY!,
      secret: process.env.COINSPOT_SECRET!,
    },
  });

  const orderId = process.argv[2];

  if (!orderId) {
    console.error("Usage: tsx cancelOrderBuy.ts <orderId>");
    process.exit(1);
  }

  console.log(`Canceling buy order ${orderId}...\n`);

  const result = await client.fullAccess.cancelOrderBuy(orderId);

  console.log("Result:");
  console.log(`  Status: ${result.status}`);
  console.log(`  Message: ${result.message || "N/A"}`);
  console.log(`  Order ID: ${result.orderId || "N/A"}`);
}

main().catch(console.error);
