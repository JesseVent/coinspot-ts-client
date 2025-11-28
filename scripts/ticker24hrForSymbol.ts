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
  console.log(`  Symbol: ${result.symbol}`);
  console.log(`  Last Price: ${result.lastPrice}`);
  console.log(`  Bid Price: ${result.bidPrice}`);
  console.log(`  Ask Price: ${result.askPrice}`);
}

main().catch(console.error);
