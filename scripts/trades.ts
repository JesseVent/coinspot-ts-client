#!/usr/bin/env tsx
/**
 * Get recent trades for a symbol
 * Endpoint: GET /pubapi/v2/orders/completed/{cointype}
 */

import { CoinspotClient } from "../index";

async function main() {
  const client = new CoinspotClient();
  const symbol = process.argv[2] || "BTC";

  console.log(`Fetching recent trades for ${symbol}...\n`);

  const result = await client.public.trades(symbol);

  const allTrades = [...result.buyorders, ...result.sellorders];
  console.log(
    `Result: ${allTrades.length} trades (${result.buyorders.length} buys, ${result.sellorders.length} sells)`,
  );

  if (allTrades.length > 0) {
    console.log("\nMost recent 5 trades:");
    allTrades.slice(0, 5).forEach((trade) => {
      const date = trade.solddate
        ? new Date(trade.solddate).toISOString()
        : "N/A";
      console.log(
        `  ${date}: ${trade.amount} @ ${trade.rate} (total: ${trade.total})`,
      );
    });
  }
}

main().catch(console.error);
