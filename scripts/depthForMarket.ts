#!/usr/bin/env tsx
/**
 * Get order book depth for a symbol/quote market pair
 * Endpoint: GET /pubapi/v2/orders/open/{cointype}/{markettype}
 */

import { CoinspotClient } from '../index';

async function main() {
  const client = new CoinspotClient();
  const symbol = process.argv[2] || 'BTC';
  const quote = process.argv[3] || 'USDT';

  console.log(`Fetching order book depth for ${symbol}/${quote}...\n`);

  const result = await client.public.depthForMarket(symbol, quote);

  console.log('Result:');
  console.log(`  Last Update ID: ${result.lastUpdateId}`);
  console.log(`  Bids: ${result.bids.length} levels`);
  console.log(`  Asks: ${result.asks.length} levels`);

  if (result.bids.length > 0) {
    console.log(`\n  Top 3 Bids:`);
    result.bids.slice(0, 3).forEach(([price, qty]) => {
      console.log(`    ${price} @ ${qty}`);
    });
  }

  if (result.asks.length > 0) {
    console.log(`\n  Top 3 Asks:`);
    result.asks.slice(0, 3).forEach(([price, qty]) => {
      console.log(`    ${price} @ ${qty}`);
    });
  }
}

main().catch(console.error);
