#!/usr/bin/env tsx
/**
 * Get order book depth for AUD market
 * Endpoint: GET /pubapi/v2/orders/open/{cointype}
 */

import { CoinspotClient } from "../index";

async function main() {
  const client = new CoinspotClient();
  const symbol = process.argv[2] || "BTC";

  console.log(`Fetching order book depth for ${symbol}...\n`);

  const result = await client.public.depth(symbol);

  console.log("Result:");
  console.log(`  Buy Orders: ${result.buyorders.length} levels`);
  console.log(`  Sell Orders: ${result.sellorders.length} levels`);

  if (result.buyorders.length > 0) {
    console.log(`\n  Top 3 Buy Orders:`);
    result.buyorders.slice(0, 3).forEach((order) => {
      console.log(
        `    ${order.rate} @ ${order.amount} (total: ${order.total})`,
      );
    });
  }

  if (result.sellorders.length > 0) {
    console.log(`\n  Top 3 Sell Orders:`);
    result.sellorders.slice(0, 3).forEach((order) => {
      console.log(
        `    ${order.rate} @ ${order.amount} (total: ${order.total})`,
      );
    });
  }
}

main().catch(console.error);
