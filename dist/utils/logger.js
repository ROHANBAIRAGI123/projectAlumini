"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const path_1 = __importDefault(require("path"));
const { combine, timestamp, printf, colorize } = winston_1.format;
// Custom format for console logging
const consoleLogFormat = printf(({ level, message, timestamp }) => {
    return `\n${timestamp} [${level}]: ${message}`;
});
// Custom format for file logging (JSON)
const fileLogFormat = combine(timestamp(), winston_1.format.errors({ stack: true }), winston_1.format.json());
// Create logs directory path
const logsDir = path_1.default.join(__dirname, "../../logs");
// Create a Winston logger
const logger = (0, winston_1.createLogger)({
    level: "info",
    transports: [
        // Console transport with colors
        new winston_1.transports.Console({
            format: combine(colorize(), timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), consoleLogFormat),
        }),
        // File transport
        new winston_1.transports.File({
            filename: path_1.default.join(logsDir, "app.log"),
            format: fileLogFormat,
        }),
        // Error-only file transport
        new winston_1.transports.File({
            filename: path_1.default.join(logsDir, "error.log"),
            level: "error",
            format: fileLogFormat,
        }),
    ],
    exceptionHandlers: [
        new winston_1.transports.File({
            filename: path_1.default.join(logsDir, "exceptions.log"),
            format: fileLogFormat,
        }),
    ],
});
// Log unhandled promise rejections
process.on("unhandledRejection", (reason) => {
    logger.error("Unhandled Rejection:", reason);
});
exports.default = logger;
