"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const logger_1 = __importDefault(require("../utils/logger"));
const dbConfig = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "projectAlumini",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
};
const pool = promise_1.default.createPool(dbConfig);
pool.on("connection", (connection) => {
    logger_1.default.info("Database connection established", connection.threadId);
});
pool.on("release", (connection) => {
    logger_1.default.info("Database connection released", connection.threadId);
});
pool.on("enqueue", () => {
    logger_1.default.info("Waiting for available connection slot");
});
exports.default = pool;
