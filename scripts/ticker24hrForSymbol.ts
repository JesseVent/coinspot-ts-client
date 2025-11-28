#!/usr/bin/env tsx
/**
 * Get 24-hour price change statistics for a specific symbol
 * Endpoint: GET /pubapi/v2/latest/{cointype}
 */

import { CoinspotClient } from "../index";

async function main() {
  const client = new CoinspotClient();
  const symbol = process.argv[2] || "BTC";

  console.log(`Fetching 24hr ticker for ${symbol}...\n`);

  const result = await client.public.ticker24hrForSymbol(symbol);

  console.log("Result:");
  console.log(`  Symbol: ${symbol}`);
  console.log(`  Last Price: ${result.prices.last}`);
  console.log(`  Bid Price: ${result.prices.bid}`);
  console.log(`  Ask Price: ${result.prices.ask}`);
}

main().catch(console.error);
