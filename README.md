# CoinSpot v2 TypeScript Client

Modern, typed client for the CoinSpot v2 API with retries, per-minute rate limiting, and zod-powered runtime validation. Public, full-access, and read-only APIs are all supported with matching endpoints.

## Installation

```bash
npm install coinspot-ts-client
```

or

```bash
pnpm add coinspot-ts-client
```

## Quick Start

```ts
import { CoinspotClient } from 'coinspot-ts-client';

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

## API Methods Overview

The client provides three API interfaces: `client.public`, `client.fullAccess`, and `client.readOnly`.

### Public API Methods (`client.public`)

The public API provides access to market data without authentication:

- `ticker24hr()` - Get 24-hour price change statistics for all markets
- `ticker24hrForSymbol(symbol)` - Get 24-hour price change statistics for a specific symbol
- `ticker24hrForMarket(symbol, quote)` - Get 24-hour price change for a symbol/quote pair
- `avgPrice(symbol)` - Get average price for a symbol (using buy price)
- `avgPriceForMarket(symbol, quote)` - Get average price for a symbol/quote market
- `bookTickerBid(symbol)` - Get bid price for a symbol (using CoinSpot sell price)
- `bookTickerBidForMarket(symbol, quote)` - Get bid price for a symbol/quote market
- `depth(symbol)` - Get order book depth for AUD market
- `depthForMarket(symbol, quote)` - Get order book depth for a symbol/quote market
- `trades(symbol)` - Get recent trades for a symbol
- `tradesForMarket(symbol, quote)` - Get recent trades for a symbol/quote market
- `aggTrades(symbol)` - Get aggregated trade summary for a symbol
- `aggTradesForMarket(symbol, quote)` - Get aggregated trade summary for a symbol/quote market

### Full Access API Methods (`client.fullAccess`)

The full access API provides trading functionality and requires authentication:

#### Account Methods
- `account()` - Get account status and information

#### Deposit & Withdrawal Methods
- `capitalDepositAddress(cointype)` - Get deposit address for a coin type

#### Order Quote Methods
- `orderQuoteBuy(cointype, amount, amounttype)` - Get quote for buying
- `orderQuoteSell(cointype, amount, amounttype)` - Get quote for selling
- `orderQuoteSwap(cointypesell, cointypebuy, amount)` - Get quote for swapping

#### Order Placement Methods
- `createOrderBuy(params)` - Create a buy order
- `updateOrderBuy(params)` - Update an existing buy order
- `orderMarketBuyNow(params)` - Place a market buy order
- `createOrderSell(params)` - Create a sell order
- `updateOrderSell(params)` - Update an existing sell order
- `orderMarketSellNow(params)` - Place a market sell order
- `orderSwapNow(params)` - Place a swap order

#### Order Cancellation Methods
- `cancelOrderBuy(id)` - Cancel a buy order
- `cancelOpenOrdersBuy(params?)` - Cancel all buy orders
- `cancelOrderSell(id)` - Cancel a sell order
- `cancelOpenOrdersSell(params?)` - Cancel all sell orders

#### Withdrawal Methods
- `withdrawDetails(params)` - Get withdrawal details for a coin type
- `withdraw(params)` - Submit a withdrawal request

### Read-Only API Methods (`client.readOnly`)

The read-only API provides account and transaction history without trading permissions:

#### Account Methods
- `account()` - Get account status and information
- `accountBalances()` - Get all account balances
- `assetBalance(params)` - Get balance for a specific asset

#### Order Methods
- `marketDepth(params)` - Get market order book depth
- `openMarketOrders(params)` - Get open market orders
- `openLimitOrders(params)` - Get open limit orders
- `allOrders(params)` - Get all historical orders
- `allMarketOrders(params)` - Get all historical market orders

#### Transaction History Methods
- `marketTrades(params)` - Get market trades with fees
- `transferHistory(params)` - Get send/receive history
- `fiatDepositHistory(params)` - Get fiat deposit history
- `fiatWithdrawalHistory(params)` - Get fiat withdrawal history
- `affiliatePayments()` - Get affiliate payments received
- `referralPayments()` - Get referral payments received

## API Endpoints Mapping

### Public API Endpoints
- `GET /pubapi/v2/latest` → `client.public.ticker24hr()`
- `GET /pubapi/v2/latest/{cointype}` → `client.public.ticker24hrForSymbol(symbol)`
- `GET /pubapi/v2/latest/{cointype}/{markettype}` → `client.public.ticker24hrForMarket(symbol, quote)`
- `GET /pubapi/v2/buyprice/{cointype}` → `client.public.avgPrice(symbol)`
- `GET /pubapi/v2/buyprice/{cointype}/{markettype}` → `client.public.avgPriceForMarket(symbol, quote)`
- `GET /pubapi/v2/sellprice/{cointype}` → `client.public.bookTickerBid(symbol)`
- `GET /pubapi/v2/sellprice/{cointype}/{markettype}` → `client.public.bookTickerBidForMarket(symbol, quote)`
- `GET /pubapi/v2/orders/open/{cointype}` → `client.public.depth(symbol)`
- `GET /pubapi/v2/orders/open/{cointype}/{markettype}` → `client.public.depthForMarket(symbol, quote)`
- `GET /pubapi/v2/orders/completed/{cointype}` → `client.public.trades(symbol)`
- `GET /pubapi/v2/orders/completed/{cointype}/{markettype}` → `client.public.tradesForMarket(symbol, quote)`
- `GET /pubapi/v2/orders/summary/completed/{cointype}` → `client.public.aggTrades(symbol)`
- `GET /pubapi/v2/orders/summary/completed/{cointype}/{markettype}` → `client.public.aggTradesForMarket(symbol, quote)`

### Full Access API Endpoints
- `POST /api/v2/status` → `client.fullAccess.account()`
- `POST /api/v2/my/coin/deposit` → `client.fullAccess.capitalDepositAddress(cointype)`
- `POST /api/v2/quote/buy/now` → `client.fullAccess.orderQuoteBuy(cointype, amount, amounttype)`
- `POST /api/v2/quote/sell/now` → `client.fullAccess.orderQuoteSell(cointype, amount, amounttype)`
- `POST /api/v2/quote/swap/now` → `client.fullAccess.orderQuoteSwap(cointypesell, cointypebuy, amount)`
- `POST /api/v2/my/buy` → `client.fullAccess.createOrderBuy(params)`
- `POST /api/v2/my/buy/edit` → `client.fullAccess.updateOrderBuy(params)`
- `POST /api/v2/my/buy/now` → `client.fullAccess.orderMarketBuyNow(params)`
- `POST /api/v2/my/sell` → `client.fullAccess.createOrderSell(params)`
- `POST /api/v2/my/sell/edit` → `client.fullAccess.updateOrderSell(params)`
- `POST /api/v2/my/sell/now` → `client.fullAccess.orderMarketSellNow(params)`
- `POST /api/v2/my/swap/now` → `client.fullAccess.orderSwapNow(params)`
- `POST /api/v2/my/buy/cancel` → `client.fullAccess.cancelOrderBuy(id)`
- `POST /api/v2/my/buy/cancel/all` → `client.fullAccess.cancelOpenOrdersBuy(params?)`
- `POST /api/v2/my/sell/cancel` → `client.fullAccess.cancelOrderSell(id)`
- `POST /api/v2/my/sell/cancel/all` → `client.fullAccess.cancelOpenOrdersSell(params?)`
- `POST /api/v2/my/coin/withdraw/senddetails` → `client.fullAccess.withdrawDetails(params)`
- `POST /api/v2/my/coin/withdraw/send` → `client.fullAccess.withdraw(params)`

### Read-Only API Endpoints
- `POST /api/v2/ro/status` → `client.readOnly.account()`
- `POST /api/v2/ro/orders/market/open` → `client.readOnly.marketDepth(params)`
- `POST /api/v2/ro/orders/market/completed` → `client.readOnly.marketTrades(params)`
- `POST /api/v2/ro/my/balances` → `client.readOnly.accountBalances()`
- `POST /api/v2/ro/my/balance/{cointype}` → `client.readOnly.assetBalance(params)` (with optional available parameter)
- `POST /api/v2/ro/my/orders/market/open` → `client.readOnly.openMarketOrders(params)`
- `POST /api/v2/ro/my/orders/limit/open` → `client.readOnly.openLimitOrders(params)`
- `POST /api/v2/ro/my/orders/completed` → `client.readOnly.allOrders(params)`
- `POST /api/v2/ro/my/orders/market/completed` → `client.readOnly.allMarketOrders(params)`
- `POST /api/v2/ro/my/sendreceive` → `client.readOnly.transferHistory(params)`
- `POST /api/v2/ro/my/deposits` → `client.readOnly.fiatDepositHistory(params)`
- `POST /api/v2/ro/my/withdrawals` → `client.readOnly.fiatWithdrawalHistory(params)`
- `POST /api/v2/ro/my/affiliatepayments` → `client.readOnly.affiliatePayments()`
- `POST /api/v2/ro/my/referralpayments` → `client.readOnly.referralPayments()`

## Schema Normalization

The client includes a schema-normalizer module that provides utilities to map CoinSpot API responses to Binance-like shapes for use with generic adapters. This is particularly useful when integrating with systems built for Binance's API format.

Available normalization functions:
- `toBinanceDepth()` - Maps CoinSpot depth responses to Binance depth format
- `toBinanceTrades()` - Maps CoinSpot trade responses to Binance recent trades format
- `toBinanceAggTrades()` - Maps CoinSpot trade responses to Binance aggregate trades format
- `toBinanceBalances()` - Maps CoinSpot balance responses to Binance account balances format

## Features

- Full typings for every endpoint plus zod validation on every response.
- Built-in retries with exponential backoff (default: 3 attempts, 200ms start, 2s max).
- Rate limiting matching CoinSpot guidance (default: 995 requests/60s) across all public/private/RO calls.
- Automatic nonce injection and HMAC-SHA512 signing for authenticated requests.
- Small surface area: `client.public`, `client.fullAccess`, and `client.readOnly`.
- Public market endpoints are case-sensitive on the `markettype` path segment; use lowercase (e.g. `usdt`) to avoid 404s.
- Public price/buy/sell endpoints sometimes return numeric fields as strings (and even `"NaN"` for thin pairs); schemas coerce to `number | null`. If you need strict numbers, re-normalize downstream.

## Error Handling

- `CoinspotHttpError`: Non-2xx HTTP status, includes `statusCode` and `responseText`.
- `CoinspotSchemaError`: Response body failed zod validation, includes `issues` and raw `payload`.

Both are exported from `client.ts` and can be caught explicitly.

## Development

Install dependencies:

```sh
pnpm install
```

Build the project:

```sh
pnpm run build
```

Run type checking:

```sh
pnpm run compile
```

Format code:

```sh
pnpm run format
```