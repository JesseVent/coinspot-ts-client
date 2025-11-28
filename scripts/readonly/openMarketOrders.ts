#!/usr/bin/env tsx
/**
 * Get open market orders
 * Endpoint: POST /api/v2/ro/my/orders/market/open
 * Requires: Read-Only API key
 */

import { CoinspotClient } from "../../index";

async function main() {
  const client = new CoinspotClient({
    readOnly: {
      key: process.env.COINSPOT_RO_KEY!,
      secret: process.env.COINSPOT_RO_SECRET!,
    },
  });

  const cointype = process.argv[2];
  const markettype = process.argv[3];

  console.log(
    `Fetching open market orders${cointype ? ` for ${cointype}` : ""}${markettype ? `/${markettype}` : ""}...\n`,
  );

  const result = await client.readOnly.openMarketOrders({
    cointype,
    markettype,
  });

  const allOrders = [...result.buyorders, ...result.sellorders];
  console.log(
    `Result: ${allOrders.length} open orders (${result.buyorders.length} buys, ${result.sellorders.length} sells)`,
  );

  if (allOrders.length > 0) {
    console.log("\nOpen orders:");
    allOrders.forEach((order) => {
      const date = new Date(order.created).toISOString();
      console.log(
        `  [${order.id}] ${order.coin}/${order.market}: ${order.amount} @ ${order.rate} (total: ${order.total}) - ${date}`,
      );
    });
  }
}

main().catch(console.error);
