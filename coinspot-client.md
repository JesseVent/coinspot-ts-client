# CoinSpot v2 TypeScript client

Modern, typed client for the CoinSpot v2 API with retries, per-minute rate limiting, and zod-powered runtime validation. Public, full-access, and read-only APIs are all supported with matching endpoints.

## Quick start

```ts
import { CoinspotClient } from './src/coinspot';

const client = new CoinspotClient({
  fullAccess: { key: process.env.COINSPOT_KEY!, secret: process.env.COINSPOT_SECRET! },
  readOnly: { key: process.env.COINSPOT_RO_KEY!, secret: process.env.COINSPOT_RO_SECRET! }, // optional; falls back to fullAccess if omitted
  rateLimit: { maxRequests: 995, perSeconds: 60 }, // optional
});

async function run() {
  const prices = await client.public.getLatestPrices();
  const balances = await client.readOnly.getBalances();
  const buyQuote = await client.fullAccess.getBuyNowQuote('BTC', 100, 'aud');
  console.log(prices.prices.btc, balances.balances.length, buyQuote.rate);
}
```

Install dependencies in this repo:

```sh
pnpm install
```

## Features

- Full typings for every endpoint plus zod validation on every response.
- Built-in retries with exponential backoff (default: 3 attempts, 200ms start, 2s max).
- Rate limiting matching CoinSpot guidance (default: 995 requests/60s) across all public/private/RO calls.
- Automatic nonce injection and HMAC-SHA512 signing for authenticated requests.
- Small surface area: `client.public`, `client.fullAccess`, and `client.readOnly`.
- Request/response types are exported for every method (e.g. `PlaceMarketBuyOrderParams`, `ReadOnlyBalancesResponse`); run `pnpm tsc --emitDeclarationOnly --declaration --outDir dist-types` if you want standalone `.d.ts` emission.

## Config options

`CoinspotClientOptions` (all optional):

- `fullAccess` / `readOnly`: `{ key: string; secret: string }` credentials.
- `baseUrls`: override public/private/read-only base URLs if needed.
- `rateLimit`: `{ maxRequests: number; perSeconds: number }`.
- `retries`: `{ maxRetries: number; minDelayMs: number; maxDelayMs: number; backoffFactor: number }`.
- `nonceFactory`: custom nonce generator (default: `Date.now()`).
- `timeoutMs`: request timeout in milliseconds (default: 15000).
- `userAgent`: user agent header (default: `coinspot-ts-client/1.0.0`).

## Endpoint map

- **Public (`client.public`)**: latest prices, buy/sell price, open/completed orders (with/without markets), summaries.
- **Full access (`client.fullAccess`)**: status, deposit addresses, buy/sell/swap quotes, market buy/sell, buy-now/sell-now/swap-now, edit/cancel orders, withdrawal details, and send coins.
- **Read only (`client.readOnly`)**: status, market order books/history, balances, per-coin balance, open/limit orders, completed orders (market and full), send/receive, deposits, withdrawals, affiliate payments, referral payments.

Each method includes a docstring with the HTTP path it targets; responses are typed via exported zod schemas in `src/coinspot/schemas.ts`.

## Error handling

- `CoinspotHttpError`: non-2xx HTTP status, includes `statusCode` and `responseText`.
- `CoinspotSchemaError`: response body failed zod validation, includes `issues` and raw `payload`.

Both are exported from `src/coinspot/client.ts` and can be caught explicitly.
