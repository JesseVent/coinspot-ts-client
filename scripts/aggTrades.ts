#!/usr/bin/env tsx
/**
 * Get aggregated trade summary for a symbol
 * Endpoint: GET /pubapi/v2/orders/completed/{cointype}
 */

import { CoinspotClient } from "../index";

async function main() {
  const client = new CoinspotClient();
  const symbol = process.argv[2] || "BTC";

  console.log(`Fetching aggregated trades for ${symbol}...\n`);

  const result = await client.public.aggTrades(symbol);

  console.log(`Result: ${result.orders.length} aggregated trades`);

  if (result.orders.length > 0) {
    console.log("\nMost recent 5 aggregated trades:");
    result.orders.slice(0, 5).forEach((trade) => {
      console.log(
        `  ${trade.coin}: ${trade.amount} @ ${trade.rate} (total: ${trade.total})`,
      );
    });
  }
}

main().catch(console.error);
