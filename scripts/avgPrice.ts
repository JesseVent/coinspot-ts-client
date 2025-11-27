#!/usr/bin/env tsx
/**
 * Get average price for a symbol (using buy price)
 * Endpoint: GET /pubapi/v2/buyprice/{cointype}
 */

import { CoinspotClient } from '../index';

async function main() {
  const client = new CoinspotClient();
  const symbol = process.argv[2] || 'BTC';

  console.log(`Fetching average buy price for ${symbol}...\n`);

  const result = await client.public.avgPrice(symbol);

  console.log('Result:');
  console.log(`  Price: ${result.price}`);
}

main().catch(console.error);
