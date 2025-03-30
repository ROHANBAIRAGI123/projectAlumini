import mysql from "mysql2/promise";
import logger from "../utils/logger";
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "projectAlumini",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const pool = mysql.createPool(dbConfig);

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
