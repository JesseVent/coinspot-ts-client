"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinanceReadOnlyApi = exports.BinanceFullAccessApi = exports.BinancePublicApi = exports.BinanceClient = exports.WrappedReadOnlyApi = exports.WrappedFullAccessApi = exports.WrappedPublicApi = exports.WrappedClient = void 0;
__exportStar(require("./client"), exports);
__exportStar(require("./schemas"), exports);
__exportStar(require("./schema-normalizer"), exports);
var binance_wrapper_1 = require("./binance-wrapper");
Object.defineProperty(exports, "WrappedClient", { enumerable: true, get: function () { return binance_wrapper_1.WrappedClient; } });
Object.defineProperty(exports, "WrappedPublicApi", { enumerable: true, get: function () { return binance_wrapper_1.WrappedPublicApi; } });
Object.defineProperty(exports, "WrappedFullAccessApi", { enumerable: true, get: function () { return binance_wrapper_1.WrappedFullAccessApi; } });
Object.defineProperty(exports, "WrappedReadOnlyApi", { enumerable: true, get: function () { return binance_wrapper_1.WrappedReadOnlyApi; } });
// Legacy exports (deprecated)
Object.defineProperty(exports, "BinanceClient", { enumerable: true, get: function () { return binance_wrapper_1.BinanceClient; } });
Object.defineProperty(exports, "BinancePublicApi", { enumerable: true, get: function () { return binance_wrapper_1.BinancePublicApi; } });
Object.defineProperty(exports, "BinanceFullAccessApi", { enumerable: true, get: function () { return binance_wrapper_1.BinanceFullAccessApi; } });
Object.defineProperty(exports, "BinanceReadOnlyApi", { enumerable: true, get: function () { return binance_wrapper_1.BinanceReadOnlyApi; } });
