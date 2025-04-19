import mysql from "mysql2/promise";
import logger from "../utils/logger";
import dotenv from "dotenv";
dotenv.config();

//database configuration
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "projectAlumini",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};
//database connection pool
const pool = mysql.createPool(dbConfig);

//database connection events
pool.on("connection", (connection) => {
  logger.info("Database connection established", connection.threadId);
});
pool.on("release", (connection) => {
  logger.info("Database connection released", connection.threadId);
});
pool.on("enqueue", () => {
  logger.info("Waiting for available connection slot");
});
export default pool;
