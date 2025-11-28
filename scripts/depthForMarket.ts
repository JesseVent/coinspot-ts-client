#!/usr/bin/env tsx
/**
 * Get order book depth for a symbol/quote market pair
 * Endpoint: GET /pubapi/v2/orders/open/{cointype}/{markettype}
 */

import { CoinspotClient } from "../index";

async function main() {
  const client = new CoinspotClient();
  const symbol = process.argv[2] || "BTC";
  const quote = process.argv[3] || "USDT";

  console.log(`Fetching order book depth for ${symbol}/${quote}...\n`);

  const result = await client.public.depthForMarket(symbol, quote);

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
