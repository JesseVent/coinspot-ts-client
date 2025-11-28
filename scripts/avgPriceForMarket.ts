#!/usr/bin/env tsx
/**
 * Get average price for a symbol/quote market pair
 * Endpoint: GET /pubapi/v2/buyprice/{cointype}/{markettype}
 */

import { CoinspotClient } from "../index";

async function main() {
  const client = new CoinspotClient();
  const symbol = process.argv[2] || "BTC";
  const quote = process.argv[3] || "USDT";

  console.log(`Fetching average buy price for ${symbol}/${quote}...\n`);

  const result = await client.public.avgPriceForMarket(symbol, quote);

  console.log("Result:");
  console.log(`  Price: ${result.price}`);
}

main().catch(console.error);
