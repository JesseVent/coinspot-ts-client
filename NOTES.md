# CoinSpot Session Notes

## Testing checklist
- `MARKET=usdt npx ts-node scripts/coinspot_probe.ts latestCoinMarket` (public /latest/{cointype}/market)
- `npx ts-node scripts/coinspot_probe.ts latest latestCoin buyPrice sellPrice` (public indexes; schema now accepts string/"NaN")
- `npx ts-node scripts/coinspot_probe.ts marketBuy marketSell` → resting orders (rate set ±5% from live quote)
- `npx ts-node scripts/coinspot_probe.ts editBuy editSell` → adjust first open orders (+3%/-3%)
- `npx ts-node scripts/coinspot_probe.ts cancelBuy cancelSell cancelBuyAll cancelSellAll` → order cancellation flows
- `npx ts-node scripts/coinspot_probe.ts myOpenMarket myOpenLimit myHistory myMarketHistory marketCompleted` → read-only snapshots
- `npx ts-node scripts/coinspot_probe.ts swapQuote` and `ALLOW_RISKY=true ... swapNow5` → BTC→MNT quote and execution
- `ALLOW_RISKY=true ... buyNow5 sellNow5` → instant fills for quick verification

## Observations
- Public price endpoints often return numbers as strings (or `"NaN"`). Schemas coerce to `number | null`. Watch for re‑normalizing downstream.
- `/latest/{cointype}/{markettype}` and other market routes are case‑sensitive—always lowercase the `markettype` (e.g., `usdt`, `btc`).
- The speculative OpenAPI (`coinspot_openapi.yaml`) now mirrors all tested flows, keys, and request examples; feed it to generators for clients, docs, or validation.
- The probe still requires API keys because it uses the same client for every call, even public ones. Use `COINSPOT_API_KEY/SECRET` or `COINSPOT_KEY/SECRET`.
- JSON outputs land under `docs/api-samples/` (timestamps in filenames) and double as sample payloads for the spec (these are hidden from git as they contain private API responses).

## Next steps
1. Wire `coinspot_openapi.yaml` into CI/docs for automated linting or codegen (Redocly, `openapi-generator`, etc.).
2. Keep local `docs/api-samples/` data alongside the spec as canonical examples for SDKs or new adapters.
3. When you need new CoinSpot operations (e.g., withdrawals, Webhooks), add them to the spec and reuse the `scripts/coinspot_probe.ts` pattern to capture request/response pairs.
4. Generated code and documentation are now organized in the `generated/` directory and excluded from version control (see `generated/README.md`).
