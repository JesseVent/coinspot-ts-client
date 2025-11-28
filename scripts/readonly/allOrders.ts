#!/usr/bin/env tsx
/**
 * Get all historical orders
 * Endpoint: POST /api/v2/ro/my/orders/completed
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
  const limit = process.argv[4] ? parseInt(process.argv[4]) : undefined;

  console.log(
    `Fetching historical orders${cointype ? ` for ${cointype}` : ""}${markettype ? `/${markettype}` : ""}${limit ? ` (limit: ${limit})` : ""}...\n`,
  );

  const result = await client.readOnly.allOrders({
    cointype,
    markettype,
    limit,
  });

  const allOrders = [...result.buyorders, ...result.sellorders];
  console.log(
    `Result: ${allOrders.length} orders (${result.buyorders.length} buys, ${result.sellorders.length} sells)`,
  );

  if (allOrders.length > 0) {
    console.log("\nMost recent 10 orders:");
    allOrders.slice(0, 10).forEach((order) => {
      const date = order.solddate
        ? new Date(order.solddate).toISOString()
        : "N/A";
      console.log(
        `  ${order.coin}/${order.market || "AUD"}: ${order.amount} @ ${order.rate} (total: ${order.total}) - ${date}`,
      );
    });
  }
}

main().catch(console.error);
