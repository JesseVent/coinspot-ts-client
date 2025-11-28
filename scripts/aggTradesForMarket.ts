#!/usr/bin/env tsx
/**
 * Get aggregated trade summary for a symbol/quote market pair
 * Endpoint: GET /pubapi/v2/orders/completed/{cointype}/{markettype}
 */

import { CoinspotClient } from "../index";

async function main() {
  const client = new CoinspotClient();
  const symbol = process.argv[2] || "BTC";
  const quote = process.argv[3] || "USDT";

  console.log(`Fetching aggregated trades for ${symbol}/${quote}...\n`);

  const result = await client.public.aggTradesForMarket(symbol, quote);

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
