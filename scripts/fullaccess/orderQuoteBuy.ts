#!/usr/bin/env tsx
/**
 * Get quote for buying
 * Endpoint: POST /api/v2/quote/buy/now
 * Requires: Full Access API key
 */

import { CoinspotClient } from "../../index";

async function main() {
  const client = new CoinspotClient({
    fullAccess: {
      key: process.env.COINSPOT_KEY!,
      secret: process.env.COINSPOT_SECRET!,
    },
  });

  const cointype = process.argv[2] || "BTC";
  const amount = parseFloat(process.argv[3] || "100");
  const amounttype = (process.argv[4] || "aud") as "coin" | "aud";

  console.log(
    `Getting buy quote for ${amount} ${amounttype} of ${cointype}...\n`,
  );

  const result = await client.fullAccess.orderQuoteBuy(
    cointype,
    amount,
    amounttype,
  );

  console.log("Result:");
  console.log(`  Status: ${result.status}`);
  console.log(`  Rate: ${result.rate}`);
  console.log(`  Message: ${result.message || "N/A"}`);
}

main().catch(console.error);
