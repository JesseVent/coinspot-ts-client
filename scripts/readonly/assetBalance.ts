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

  console.log("Result:");
  console.log(`  Asset: ${result.asset}`);
  console.log(`  Free: ${result.free}`);
  console.log(`  Locked: ${result.locked}`);
}

main().catch(console.error);
