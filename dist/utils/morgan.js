"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const morgan_1 = __importDefault(require("morgan"));
const logger_1 = require("./logger");
// Skip all the Morgan http log if the application is not running in development mode.
const skip = (_req, _res) => {
    const env = process.env.NODE_ENV || "development";
    return env !== "development";
};
// Build the morgan middleware
const morganMiddleware = (0, morgan_1.default)(":method :url :status :res[content-length] - :response-time ms", { stream: logger_1.stream, skip });
exports.default = morganMiddleware;
