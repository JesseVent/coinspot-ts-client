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

  // Flatten the array of records into a single list of [coin, balance] entries
  const allBalances = result.balances.flatMap((record) =>
    Object.entries(record).map(([coin, balance]) => ({ coin, ...balance })),
  );

  console.log(`Result: ${allBalances.length} balances`);

  const nonZeroBalances = allBalances.filter(
    (b) => b.balance > 0 || (b.available && b.available > 0),
  );

  if (nonZeroBalances.length > 0) {
    console.log("\nNon-zero balances:");
    nonZeroBalances.forEach((balance) => {
      const available = balance.available ?? balance.balance;
      const locked = balance.balance - available;
      console.log(
        `  ${balance.coin}: balance=${balance.balance}, available=${available}, locked=${locked}`,
      );
    });
  } else {
    console.log("\nNo non-zero balances found");
  }
}

main().catch(console.error);
