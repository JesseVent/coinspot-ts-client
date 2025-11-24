/**
 * CoinSpot schema probe helper (using coinspot-ts-client).
 *
 * Usage (safe default set):
 *   COINSPOT_API_KEY=... COINSPOT_API_SECRET=... npx ts-node scripts/coinspot_probe.ts
 *
 * Select endpoints:
 *   COINSPOT_API_KEY=... COINSPOT_API_SECRET=... npx ts-node scripts/coinspot_probe.ts latest balances buyQuote sellQuote
 *
 * Risky calls (executes $5 AUD buy/sell) require ALLOW_RISKY=true:
 *   ALLOW_RISKY=true COINSPOT_API_KEY=... COINSPOT_API_SECRET=... npx ts-node scripts/coinspot_probe.ts buyNow5 sellNow5
 *
 * Env overrides: COIN=BTC, MARKET=AUD, AUD_AMOUNT=5
 */
export {};
