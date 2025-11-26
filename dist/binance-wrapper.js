"use strict";
/**
 * Binance-compatible wrapper for CoinSpot API
 *
 * This module provides a Binance Spot API compatible interface that wraps
 * the CoinSpot client. Since the CoinspotClient already provides Binance-style
 * method names, this wrapper simply delegates to those methods for consistency.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinanceReadOnlyApi = exports.BinanceFullAccessApi = exports.BinancePublicApi = exports.BinanceClient = void 0;
const client_1 = require("./client");
/**
 * Main Binance-compatible client wrapper
 *
 * This is a thin wrapper around CoinspotClient that exposes the same
 * Binance-compatible API interface. The CoinspotClient already provides
 * Binance-style method names, so this wrapper primarily serves as an
 * alternative entry point with explicit Binance naming.
 */
class BinanceClient {
    constructor(options) {
        this.coinspot = new client_1.CoinspotClient(options);
        this.public = this.coinspot.public;
        this.fullAccess = this.coinspot.fullAccess;
        this.readOnly = this.coinspot.readOnly;
    }
}
exports.BinanceClient = BinanceClient;
// Re-export the API classes for convenience
var client_2 = require("./client");
Object.defineProperty(exports, "BinancePublicApi", { enumerable: true, get: function () { return client_2.CoinspotPublicApi; } });
var client_3 = require("./client");
Object.defineProperty(exports, "BinanceFullAccessApi", { enumerable: true, get: function () { return client_3.CoinspotFullAccessApi; } });
var client_4 = require("./client");
Object.defineProperty(exports, "BinanceReadOnlyApi", { enumerable: true, get: function () { return client_4.CoinspotReadOnlyApi; } });
