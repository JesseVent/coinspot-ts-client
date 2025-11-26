/**
 * Binance-compatible wrapper for CoinSpot API
 *
 * This module provides a Binance Spot API compatible interface that wraps
 * the CoinSpot client. Since the CoinspotClient already provides Binance-style
 * method names, this wrapper simply delegates to those methods for consistency.
 */
import { CoinspotClientOptions } from './client';
/**
 * Main Binance-compatible client wrapper
 *
 * This is a thin wrapper around CoinspotClient that exposes the same
 * Binance-compatible API interface. The CoinspotClient already provides
 * Binance-style method names, so this wrapper primarily serves as an
 * alternative entry point with explicit Binance naming.
 */
export declare class BinanceClient {
    readonly public: typeof this.coinspot.public;
    readonly fullAccess: typeof this.coinspot.fullAccess;
    readonly readOnly: typeof this.coinspot.readOnly;
    private readonly coinspot;
    constructor(options?: CoinspotClientOptions);
}
export { CoinspotPublicApi as BinancePublicApi } from './client';
export { CoinspotFullAccessApi as BinanceFullAccessApi } from './client';
export { CoinspotReadOnlyApi as BinanceReadOnlyApi } from './client';
