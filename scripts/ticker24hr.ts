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

  const entries = Object.entries(result.prices);
  console.log(`Received ${entries.length} markets`);
  console.log("\nSample (first 3):");
  entries.slice(0, 3).forEach(([symbol, prices]) => {
    console.log(
      `  ${symbol}: last=${prices.last}, bid=${prices.bid}, ask=${prices.ask}`,
    );
  });
}

main().catch(console.error);
