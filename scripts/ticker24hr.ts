#!/usr/bin/env tsx
/**
 * Get 24-hour price change statistics for all markets
 * Endpoint: GET /pubapi/v2/latest
 */

import { CoinspotClient } from "../index";

async function main() {
  const client = new CoinspotClient();

  console.log("Fetching 24hr ticker for all markets...\n");

  const result = await client.public.ticker24hr();

  console.log(`Received ${result.length} markets`);
  console.log("\nSample (first 3):");
  result.slice(0, 3).forEach((ticker) => {
    console.log(
      `  ${ticker.symbol}: last=${ticker.lastPrice}, bid=${ticker.bidPrice}, ask=${ticker.askPrice}`,
    );
  });
}

main().catch(console.error);
