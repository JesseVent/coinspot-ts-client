#!/usr/bin/env tsx
/**
 * Get recent trades for a symbol/quote market pair
 * Endpoint: GET /pubapi/v2/orders/completed/{cointype}/{markettype}
 */

import { CoinspotClient } from "../index";

async function main() {
  const client = new CoinspotClient();
  const symbol = process.argv[2] || "BTC";
  const quote = process.argv[3] || "USDT";

  console.log(`Fetching recent trades for ${symbol}/${quote}...\n`);

  const result = await client.public.tradesForMarket(symbol, quote);

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
