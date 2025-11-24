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

## Common Trading Examples

### Get Market Information
```ts
// Get latest prices for all coins
const prices = await client.public.getLatestPrices();

// Get latest price for specific coin (AUD market)
const btcPrice = await client.public.getLatestPricesForCoin('BTC');

// Get latest price for specific coin/market pair (e.g., BTC/USDT)
const btcUsdtPrice = await client.public.getLatestPricesForCoinMarket('BTC', 'USDT');

// Get buy/sell prices
const buyPrice = await client.public.getLatestBuyPrice('BTC');
const sellPrice = await client.public.getLatestSellPrice('BTC');

// Get market order book
const orderBook = await client.public.getOpenOrders('BTC');
```

### Account Management
```ts
// Get all account balances
const balances = await client.readOnly.getBalances();

// Get balance for specific coin
const btcBalance = await client.readOnly.getBalanceForCoin({ cointype: 'BTC' });

// Get deposit addresses for a coin
const depositAddresses = await client.fullAccess.getDepositAddresses('BTC');

// Get withdrawal details/networks
const withdrawalDetails = await client.fullAccess.getWithdrawalDetails({ cointype: 'BTC' });
```

### Trading Operations
```ts
// Get quote before placing order
const buyQuote = await client.fullAccess.getBuyNowQuote('BTC', 100, 'aud');
const sellQuote = await client.fullAccess.getSellNowQuote('BTC', 0.5, 'coin');

// Place a market buy order
const buyOrder = await client.fullAccess.placeMarketBuyOrder({
  cointype: 'BTC',
  amount: 0.1,
  rate: buyQuote.rate // or your desired rate
});

// Place a market sell order
const sellOrder = await client.fullAccess.placeMarketSellOrder({
  cointype: 'BTC',
  amount: 0.05,
  rate: sellQuote.rate // or your desired rate
});

// Execute instant buy now
const buyNow = await client.fullAccess.placeBuyNowOrder({
  cointype: 'BTC',
  amounttype: 'aud',
  amount: 100
});

// Execute instant sell now
const sellNow = await client.fullAccess.placeSellNowOrder({
  cointype: 'BTC',
  amounttype: 'coin',
  amount: 0.01
});

// Cancel an order
await client.fullAccess.cancelBuyOrder('ORDER_ID');
await client.fullAccess.cancelSellOrder('ORDER_ID');

// Cancel all orders for a coin
await client.fullAccess.cancelAllBuyOrders({ coin: 'BTC' });
await client.fullAccess.cancelAllSellOrders({ coin: 'BTC' });
```

### Order History & Management
```ts
// Get open market orders for account
const openMarketOrders = await client.readOnly.getMyOpenMarketOrders({ cointype: 'BTC' });

// Get open limit orders
const openLimitOrders = await client.readOnly.getMyOpenLimitOrders({ cointype: 'BTC' });

// Get order history
const orderHistory = await client.readOnly.getMyOrdersHistory({
  cointype: 'BTC',
  startdate: '2023-01-01',
  enddate: '2023-12-31',
  limit: 100
});

// Get completed market orders
const completedMarketOrders = await client.readOnly.getMyMarketOrdersHistory({
  cointype: 'BTC'
});
```

### Transfer Operations
```ts
// Send coins to an address
const sendResult = await client.fullAccess.sendCoins({
  cointype: 'BTC',
  amount: 0.1,
  address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
  emailconfirm: 'YES' // optional
});

// Get send/receive history
const history = await client.readOnly.getSendReceiveHistory({
  startdate: '2023-01-01',
  enddate: '2023-12-31'
});
```

### Exchange Service Integration Examples

For a generic exchange service, common operations include:

**Balance Query:**
```ts
async function getAccountBalances() {
  try {
    const balances = await client.readOnly.getBalances();
    return balances.balances.map(b => ({
      asset: b.coin,
      free: b.available || 0,
      locked: b.balance - (b.available || 0),
      total: b.balance
    }));
  } catch (error) {
    console.error('Error fetching balances:', error);
    throw error;
  }
}
```

**Place Order:**
```ts
async function placeOrder(symbol: string, side: 'buy' | 'sell', amount: number, price?: number) {
  const [baseAsset, quoteAsset] = symbol.split('/');

  if (side === 'buy') {
    if (price) {
      // Limit order
      return await client.fullAccess.placeMarketBuyOrder({
        cointype: baseAsset,
        amount: amount,
        rate: price
      });
    } else {
      // Market order
      return await client.fullAccess.placeBuyNowOrder({
        cointype: baseAsset,
        amounttype: 'aud',
        amount: amount
      });
    }
  } else {
    if (price) {
      // Limit order
      return await client.fullAccess.placeMarketSellOrder({
        cointype: baseAsset,
        amount: amount,
        rate: price
      });
    } else {
      // Market order
      return await client.fullAccess.placeSellNowOrder({
        cointype: baseAsset,
        amounttype: 'coin',
        amount: amount
      });
    }
  }
}
```

**Get Ticker:**
```ts
async function getTicker(symbol: string) {
  const [baseAsset, quoteAsset] = symbol.split('/');

  if (quoteAsset && quoteAsset.toLowerCase() !== 'aud') {
    const prices = await client.public.getLatestPricesForCoinMarket(baseAsset, quoteAsset.toLowerCase());
    return {
      symbol: symbol,
      bid: prices.prices.bid,
      ask: prices.prices.ask,
      last: prices.prices.last,
      timestamp: Date.now()
    };
  } else {
    const prices = await client.public.getLatestPricesForCoin(baseAsset);
    return {
      symbol: symbol,
      bid: prices.prices.bid,
      ask: prices.prices.ask,
      last: prices.prices.last,
      timestamp: Date.now()
    };
  }
}
```

**Get Order Book:**
```ts
async function getOrderBook(symbol: string, limit?: number) {
  const [baseAsset] = symbol.split('/');
  const book = await client.public.getOpenOrders(baseAsset);

  // Sort and limit if needed
  const asks = book.sellorders
    .sort((a, b) => a.rate - b.rate) // ascending for asks
    .slice(0, limit);

  const bids = book.buyorders
    .sort((a, b) => b.rate - a.rate) // descending for bids
    .slice(0, limit);

  return {
    symbol: symbol,
    asks: asks.map(o => [o.rate, o.amount]),
    bids: bids.map(o => [o.rate, o.amount]),
    timestamp: Date.now()
  };
}
```

## Features

- Full typings for every endpoint plus zod validation on every response.
- Built-in retries with exponential backoff (default: 3 attempts, 200ms start, 2s max).
- Rate limiting matching CoinSpot guidance (default: 995 requests/60s) across all public/private/RO calls.
- Automatic nonce injection and HMAC-SHA512 signing for authenticated requests.
- Small surface area: `client.public`, `client.fullAccess`, and `client.readOnly`.
- Request/response types are exported for every method (e.g. `NewBuyOrderParams`, `AccountBalancesResponse`); run `pnpm tsc --emitDeclarationOnly --declaration --outDir dist-types` if you want standalone `.d.ts` emission.
- Public market endpoints are case-sensitive on the `markettype` path segment; use lowercase (e.g. `usdt`) to avoid 404s.
- Public price/buy/sell endpoints sometimes return numeric fields as strings (and even `"NaN"` for thin pairs); schemas coerce to `number | null`. If you need strict numbers, re-normalize downstream.

Install dependencies in this repo:

```sh
pnpm install
```

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

## Documentation

This repository includes comprehensive documentation:

- API reference: OpenAPI specification in both YAML (`coinspot_openapi.yaml`) and JSON (`docs/coinspot-ts-client.json`) formats
- Sample responses: Real API responses in `docs/api-samples/`
- Client usage: This file and the source code
- Generated resources: Code and docs in `generated/` directory (excluded from version control)

## Generated Code

This repository also contains an OpenAPI specification (`coinspot_openapi.yaml`) which can be used to generate client libraries and server stubs for other languages. Generated code is organized in the `generated/` directory and excluded from version control (see `generated/README.md`).

## Error handling

- `CoinspotHttpError`: non-2xx HTTP status, includes `statusCode` and `responseText`.
- `CoinspotSchemaError`: response body failed zod validation, includes `issues` and raw `payload`.

Both are exported from `src/coinspot/client.ts` and can be caught explicitly.
