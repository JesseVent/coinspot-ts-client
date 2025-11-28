#!/usr/bin/env tsx
/**
 * Get recent trades for a symbol
 * Endpoint: GET /pubapi/v2/orders/completed/{cointype}
 */

import { CoinspotClient } from "../index";

async function main() {
  const client = new CoinspotClient();
  const symbol = process.argv[2] || "BTC";

  console.log(`Fetching recent trades for ${symbol}...\n`);

  const result = await client.public.trades(symbol);

  console.log(`Result: ${result.length} trades`);

  if (result.length > 0) {
    console.log("\nMost recent 5 trades:");
    result.slice(0, 5).forEach((trade) => {
      const date = new Date(trade.time).toISOString();
      console.log(
        `  ${date}: ${trade.qty} @ ${trade.price} (${trade.isBuyerMaker ? "sell" : "buy"})`,
      );
    });
  }
}

main().catch(console.error);
