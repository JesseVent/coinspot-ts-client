#!/usr/bin/env tsx
/**
 * Create a buy order
 * Endpoint: POST /api/v2/my/buy
 * Requires: Full Access API key
 */

import { CoinspotClient } from '../../index';

async function main() {
  const client = new CoinspotClient({
    fullAccess: {
      key: process.env.COINSPOT_KEY!,
      secret: process.env.COINSPOT_SECRET!,
    },
  });

  const cointype = process.argv[2] || 'BTC';
  const amount = parseFloat(process.argv[3] || '0.001');
  const rate = parseFloat(process.argv[4] || '50000');
  const markettype = process.argv[5];

  console.log(`Creating buy order: ${amount} ${cointype} @ ${rate}${markettype ? ` (${markettype})` : ''}...\n`);

  const result = await client.fullAccess.createOrderBuy({
    cointype,
    amount,
    rate,
    markettype,
  });

  console.log('Result:');
  console.log(`  Status: ${result.status}`);
  console.log(`  Symbol: ${result.symbol}`);
  console.log(`  Order ID: ${result.orderId}`);
  console.log(`  Price: ${result.price}`);
  console.log(`  Quantity: ${result.origQty}`);
  console.log(`  Side: ${result.side}`);
}

main().catch(console.error);
