#!/usr/bin/env tsx
/**
 * Get all account balances
 * Endpoint: POST /api/v2/ro/my/balances
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

  console.log("Fetching account balances...\n");

  const result = await client.readOnly.accountBalances();

  console.log(`Result: ${result.balances.length} balances`);

  const nonZeroBalances = result.balances.filter(
    (b) => parseFloat(b.free) > 0 || parseFloat(b.locked) > 0,
  );

  if (nonZeroBalances.length > 0) {
    console.log("\nNon-zero balances:");
    nonZeroBalances.forEach((balance) => {
      console.log(
        `  ${balance.asset}: free=${balance.free}, locked=${balance.locked}`,
      );
    });
  } else {
    console.log("\nNo non-zero balances found");
  }
}

main().catch(console.error);
