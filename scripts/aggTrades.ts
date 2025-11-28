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

  console.log(`Result: ${result.length} aggregated trades`);

  if (result.length > 0) {
    console.log("\nMost recent 5 aggregated trades:");
    result.slice(0, 5).forEach((trade) => {
      const date = new Date(trade.T).toISOString();
      console.log(`  ${date}: ${trade.q} @ ${trade.p} (agg ID: ${trade.a})`);
    });
  }
}

main().catch(console.error);
