#!/usr/bin/env tsx
/**
 * Get balance for a specific asset
 * Endpoint: POST /api/v2/ro/my/balance/{cointype}
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

  const cointype = process.argv[2] || "BTC";
  const available = process.argv[3] === "true";

  console.log(
    `Fetching ${cointype} balance${available ? " (available only)" : ""}...\n`,
  );

  const result = await client.readOnly.assetBalance({ cointype, available });

  // result.balance is a Record<string, balanceEntry>
  const balanceEntry = result.balance[cointype];

  if (balanceEntry) {
    const availableAmount = balanceEntry.available ?? balanceEntry.balance;
    const locked = balanceEntry.balance - availableAmount;

    console.log("Result:");
    console.log(`  Asset: ${cointype}`);
    console.log(`  Balance: ${balanceEntry.balance}`);
    console.log(`  Available: ${availableAmount}`);
    console.log(`  Locked: ${locked}`);
    console.log(`  AUD Balance: ${balanceEntry.audbalance}`);
  } else {
    console.log(`No balance found for ${cointype}`);
  }
}

main().catch(console.error);
