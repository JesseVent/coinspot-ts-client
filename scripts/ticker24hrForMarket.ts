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
  console.log(`  Symbol: ${result.symbol}`);
  console.log(`  Last Price: ${result.lastPrice}`);
  console.log(`  Bid Price: ${result.bidPrice}`);
  console.log(`  Ask Price: ${result.askPrice}`);
}

main().catch(console.error);
