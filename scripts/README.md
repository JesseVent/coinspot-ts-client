# CoinSpot API Script Examples

Executable TypeScript snippets demonstrating all CoinSpot API methods. These scripts are designed for LLM execution and rapid API testing.

## Prerequisites

```bash
npm install -g tsx  # TypeScript execution engine
```

## Environment Variables

For authenticated endpoints, set these environment variables:

```bash
export COINSPOT_KEY="your-api-key"
export COINSPOT_SECRET="your-api-secret"
export COINSPOT_RO_KEY="your-readonly-key"       # optional
export COINSPOT_RO_SECRET="your-readonly-secret" # optional
```

## Public API Scripts

No authentication required. Safe to run anytime.

### Price & Ticker

```bash
# Get 24hr ticker for all markets
tsx scripts/ticker24hr.ts

# Get 24hr ticker for specific symbol
tsx scripts/ticker24hrForSymbol.ts BTC

# Get 24hr ticker for symbol/quote pair
tsx scripts/ticker24hrForMarket.ts BTC USDT

# Get average buy price
tsx scripts/avgPrice.ts ETH

# Get average buy price for market
tsx scripts/avgPriceForMarket.ts ETH USDT
```

### Order Book & Trades

```bash
# Get order book depth
tsx scripts/depth.ts BTC

# Get order book depth for market
tsx scripts/depthForMarket.ts BTC USDT

# Get recent trades
tsx scripts/trades.ts BTC

# Get recent trades for market
tsx scripts/tradesForMarket.ts BTC USDT

# Get aggregated trades
tsx scripts/aggTrades.ts BTC

# Get aggregated trades for market
tsx scripts/aggTradesForMarket.ts BTC USDT
```

## Full Access API Scripts

Requires `COINSPOT_KEY` and `COINSPOT_SECRET` environment variables.

**⚠️ WARNING:** These scripts execute real trades and withdrawals. Use with caution!

### Account

```bash
# Get account status
tsx scripts/fullaccess/account.ts
```

### Order Quotes (Non-Binding)

```bash
# Get buy quote
tsx scripts/fullaccess/orderQuoteBuy.ts BTC 100 aud
tsx scripts/fullaccess/orderQuoteBuy.ts BTC 0.001 coin
```

### Order Placement

```bash
# Create buy order (amount, rate, optional markettype)
tsx scripts/fullaccess/createOrderBuy.ts BTC 0.001 50000
tsx scripts/fullaccess/createOrderBuy.ts BTC 0.001 50000 usdt
```

### Order Cancellation

```bash
# Cancel specific buy order
tsx scripts/fullaccess/cancelOrderBuy.ts <orderId>
```

## Read-Only API Scripts

Requires `COINSPOT_RO_KEY` and `COINSPOT_RO_SECRET` environment variables.

Falls back to `COINSPOT_KEY` and `COINSPOT_SECRET` if read-only credentials not provided.

### Balances

```bash
# Get all account balances
tsx scripts/readonly/accountBalances.ts

# Get specific asset balance
tsx scripts/readonly/assetBalance.ts BTC
tsx scripts/readonly/assetBalance.ts BTC true  # available only
```

### Orders

```bash
# Get open market orders
tsx scripts/readonly/openMarketOrders.ts
tsx scripts/readonly/openMarketOrders.ts BTC
tsx scripts/readonly/openMarketOrders.ts BTC usdt

# Get all historical orders
tsx scripts/readonly/allOrders.ts
tsx scripts/readonly/allOrders.ts BTC
tsx scripts/readonly/allOrders.ts BTC usdt 50  # with limit
```

## Script Structure

All scripts follow this pattern:

1. **Shebang**: `#!/usr/bin/env tsx` for direct execution
2. **Documentation**: Endpoint and requirements in comment header
3. **Client Setup**: Initialize appropriate CoinspotClient API
4. **Parameter Parsing**: Accept CLI arguments with sensible defaults
5. **API Call**: Execute the method
6. **Output**: Display formatted results

## For LLM Execution

These scripts are optimized for LLM agents:

- **Self-contained**: Each script is independent
- **Clear naming**: File names match API method names
- **Documented**: Headers explain endpoint and auth requirements
- **Safe defaults**: Public API scripts use non-destructive defaults
- **Error handling**: Catch and display errors clearly

## Adding New Scripts

Follow this template:

```typescript
#!/usr/bin/env tsx
/**
 * [Description]
 * Endpoint: [HTTP METHOD /path]
 * Requires: [Auth level]
 */

import { CoinspotClient } from "../index";

async function main() {
  const client = new CoinspotClient({
    // Auth config if needed
  });

  // Parse arguments
  const param = process.argv[2] || "default";

  console.log(`Doing something with ${param}...\n`);

  const result = await client.api.method(param);

  console.log("Result:");
  console.log(result);
}

main().catch(console.error);
```

## Safety Notes

- Public API scripts are safe to run repeatedly
- Full Access scripts execute **real** orders and withdrawals
- Read-Only scripts are safe but expose account information
- Always verify parameters before running full access scripts
- Use testnet or small amounts when testing

## Directory Structure

```
scripts/
├── README.md                    # This file
├── ticker24hr.ts               # Public API examples
├── ticker24hrForSymbol.ts
├── ticker24hrForMarket.ts
├── avgPrice.ts
├── avgPriceForMarket.ts
├── depth.ts
├── depthForMarket.ts
├── trades.ts
├── tradesForMarket.ts
├── aggTrades.ts
├── aggTradesForMarket.ts
├── fullaccess/
│   ├── account.ts              # Full access examples
│   ├── orderQuoteBuy.ts
│   ├── createOrderBuy.ts
│   └── cancelOrderBuy.ts
└── readonly/
    ├── accountBalances.ts      # Read-only examples
    ├── assetBalance.ts
    ├── openMarketOrders.ts
    └── allOrders.ts
```
