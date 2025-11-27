"use strict";
/**
 * Wrapped client for CoinSpot API
 *
 * This module provides a thin wrapper around CoinspotClient that exposes
 * the same Binance-compatible API interface. The CoinspotClient already
 * provides Binance-style method names, so this wrapper simply delegates
 * to those methods for consistency.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinanceReadOnlyApi = exports.BinanceFullAccessApi = exports.BinancePublicApi = exports.BinanceClient = exports.WrappedReadOnlyApi = exports.WrappedFullAccessApi = exports.WrappedPublicApi = exports.WrappedClient = void 0;
const client_1 = require("./client");
/**
 * Wrapped client that delegates to CoinspotClient
 *
 * This is a thin wrapper around CoinspotClient that exposes the same
 * Binance-compatible API interface. Use this if you prefer a wrapped
 * client pattern, or use CoinspotClient directly - they are functionally
 * identical.
 */
class WrappedClient {
    constructor(options) {
        this.coinspot = new client_1.CoinspotClient(options);
        this.public = this.coinspot.public;
        this.fullAccess = this.coinspot.fullAccess;
        this.readOnly = this.coinspot.readOnly;
    }
}
exports.WrappedClient = WrappedClient;
exports.BinanceClient = WrappedClient;
// Re-export the API classes for convenience
var client_2 = require("./client");
Object.defineProperty(exports, "WrappedPublicApi", { enumerable: true, get: function () { return client_2.CoinspotPublicApi; } });
var client_3 = require("./client");
Object.defineProperty(exports, "WrappedFullAccessApi", { enumerable: true, get: function () { return client_3.CoinspotFullAccessApi; } });
var client_4 = require("./client");
Object.defineProperty(exports, "WrappedReadOnlyApi", { enumerable: true, get: function () { return client_4.CoinspotReadOnlyApi; } });
/** @deprecated Use WrappedPublicApi instead */
var client_5 = require("./client");
Object.defineProperty(exports, "BinancePublicApi", { enumerable: true, get: function () { return client_5.CoinspotPublicApi; } });
/** @deprecated Use WrappedFullAccessApi instead */
var client_6 = require("./client");
Object.defineProperty(exports, "BinanceFullAccessApi", { enumerable: true, get: function () { return client_6.CoinspotFullAccessApi; } });
/** @deprecated Use WrappedReadOnlyApi instead */
var client_7 = require("./client");
Object.defineProperty(exports, "BinanceReadOnlyApi", { enumerable: true, get: function () { return client_7.CoinspotReadOnlyApi; } });
