# CoinSpot v2 TypeScript Client - Project Context

## Project Overview

The CoinSpot TypeScript Client is a modern, typed client library for the CoinSpot v2 API, providing comprehensive access to cryptocurrency trading functionality. It includes built-in features like retries, rate limiting, and zod-powered runtime validation. The project supports three API access levels:

- **Public API**: Access to market prices and order books without authentication
- **Full Access API**: Trading, quotes, withdrawals, and status checks (requires API key/secret)
- **Read-Only API**: Balance and history data (requires read-only API key/secret)

The library is designed with robust error handling, automatic nonce management, and HMAC-SHA512 signing for authenticated requests.

## Architecture & Key Components

### Core Files
- `client.ts`: Main client implementation with three API classes (`CoinspotPublicApi`, `CoinspotFullAccessApi`, `CoinspotReadOnlyApi`)
- `schemas.ts`: Zod schema definitions for API response validation
- `index.ts`: Main entry point exporting client and schemas
- `coinspot_openapi.yaml`: OpenAPI specification for the CoinSpot v2 API

### Key Features
- Full TypeScript typing for every endpoint with zod validation
- Built-in retries with exponential backoff (default: 3 attempts, 200ms start, 2s max)
- Rate limiting matching CoinSpot guidance (default: 995 requests/60s)
- Automatic nonce injection and HMAC-SHA512 signing
- Small surface area with clear API divisions: `client.public`, `client.fullAccess`, `client.readOnly`

### Response Handling
- All responses are validated with Zod schemas for type safety
- Price endpoints handle numeric fields that may be returned as strings or "NaN"
- Two custom error classes: `CoinspotHttpError` and `CoinspotSchemaError`

## Building and Running

### Prerequisites
- Node.js >= 18
- pnpm package manager

### Setup Commands
```bash
# Install dependencies
pnpm install

# Build the project
pnpm run build

# Run type checking
pnpm run compile

# Format code
pnpm run format

# Run linting
pnpm run lint
```

### Testing
Currently the project has a placeholder test script:
```bash
pnpm run test  # Just echoes "No tests yet"
```

## Development Conventions

### Code Structure
- Typed interfaces for all API parameters and responses
- Three distinct API classes for different access levels
- Centralized schema validation using Zod
- Rate limiting implemented with a sliding window approach
- Retry mechanism with exponential backoff

### Configuration
The `CoinspotClient` accepts various configuration options:
- API credentials for full access and read-only modes
- Custom base URLs for each API tier
- Rate limiting parameters
- Retry settings
- Custom nonce factory
- Request timeout and user agent settings

### API Usage Pattern
```ts
import { CoinspotClient } from './src/coinspot';

const client = new CoinspotClient({
  fullAccess: { key: process.env.COINSPOT_KEY!, secret: process.env.COINSPOT_SECRET! },
  readOnly: { key: process.env.COINSPOT_RO_KEY!, secret: process.env.COINSPOT_RO_SECRET! },
});

// Public endpoints (no auth required)
const prices = await client.public.getLatestPrices();

// Full access endpoints (require full access credentials)
const buyQuote = await client.fullAccess.getBuyNowQuote('BTC', 100, 'aud');

// Read-only endpoints (require read-only or full access credentials)
const balances = await client.readOnly.getBalances();
```

## Special Considerations

### Case Sensitivity
- Non-AUD market paths are case-sensitive; always use lowercase (e.g., `usdt`)
- Coin types and market types should be passed in lowercase to avoid 404 errors

### Numeric Data Handling
- Public price endpoints may return numbers as strings or even "NaN" for illiquid pairs
- Schemas automatically coerce string numbers to actual numbers or null
- If strict number handling is needed, implement additional normalization

### Error Handling
- `CoinspotHttpError`: For HTTP status codes outside the 2xx range
- `CoinspotSchemaError`: For responses that fail Zod validation
- Both error types include additional diagnostic information

## Additional Files and Tools

- `NOTES.md`: Contains testing checklists, observations, and next steps
- `scripts/coinspot_probe.ts`: A probing script for testing API endpoints
- `probe_output/`: Directory storing JSON outputs from API probes for validation
- `coinspot-ts-client.json`: Alternative JSON format of the OpenAPI spec
- Various generated ZIP files for different client implementations and documentation

## Testing and Probing

The project includes a comprehensive testing script (`scripts/coinspot_probe.ts`) that can:
- Test all API endpoints including public, private, and read-only
- Generate sample payloads for validation
- Capture request/response pairs for documentation

Example usage:
```bash
npx ts-node scripts/coinspot_probe.ts latest latestCoin buyPrice sellPrice
```