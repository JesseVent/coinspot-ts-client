/**
 * Wrapped client for CoinSpot API
 *
 * This module provides a thin wrapper around CoinspotClient that exposes
 * the same Binance-compatible API interface. The CoinspotClient already
 * provides Binance-style method names, so this wrapper simply delegates
 * to those methods for consistency.
 */

import { CoinspotClient, CoinspotClientOptions } from './client';

/**
 * Wrapped client that delegates to CoinspotClient
 *
 * This is a thin wrapper around CoinspotClient that exposes the same
 * Binance-compatible API interface. Use this if you prefer a wrapped
 * client pattern, or use CoinspotClient directly - they are functionally
 * identical.
 */
export class WrappedClient {
  readonly public: typeof this.coinspot.public;
  readonly fullAccess: typeof this.coinspot.fullAccess;
  readonly readOnly: typeof this.coinspot.readOnly;
  private readonly coinspot: CoinspotClient;

  constructor(options?: CoinspotClientOptions) {
    this.coinspot = new CoinspotClient(options);
    this.public = this.coinspot.public;
    this.fullAccess = this.coinspot.fullAccess;
    this.readOnly = this.coinspot.readOnly;
  }
}

// Re-export the API classes for convenience
export { CoinspotPublicApi as WrappedPublicApi } from './client';
export { CoinspotFullAccessApi as WrappedFullAccessApi } from './client';
export { CoinspotReadOnlyApi as WrappedReadOnlyApi } from './client';

// Legacy exports for backward compatibility (deprecated)
/** @deprecated Use WrappedClient instead */
export { WrappedClient as BinanceClient };
/** @deprecated Use WrappedPublicApi instead */
export { CoinspotPublicApi as BinancePublicApi } from './client';
/** @deprecated Use WrappedFullAccessApi instead */
export { CoinspotFullAccessApi as BinanceFullAccessApi } from './client';
/** @deprecated Use WrappedReadOnlyApi instead */
export { CoinspotReadOnlyApi as BinanceReadOnlyApi } from './client';
