#!/usr/bin/env tsx
/**
 * Get 24-hour price change statistics for a symbol/quote market pair
 * Endpoint: GET /pubapi/v2/latest/{cointype}/{markettype}
 */

import { CoinspotClient } from "../index";

async function main() {
  const client = new CoinspotClient();
  const symbol = process.argv[2] || "BTC";
  const quote = process.argv[3] || "USDT";

  console.log(`Fetching 24hr ticker for ${symbol}/${quote}...\n`);

  const result = await client.public.ticker24hrForMarket(symbol, quote);

  console.log("Result:");
  console.log(`  Symbol: ${symbol}/${quote}`);
  console.log(`  Last Price: ${result.prices.last}`);
  console.log(`  Bid Price: ${result.prices.bid}`);
  console.log(`  Ask Price: ${result.prices.ask}`);
}

main().catch(console.error);
