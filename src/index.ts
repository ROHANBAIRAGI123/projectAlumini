import dotenv from "dotenv";
import app from "./app";
import logger from "./utils/logger";
dotenv.config({
  path: "./.env",
  debug: true,
});

const PORT = process.env.PORT || 8001;

try {
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
} catch (error) {
  logger.error("Application failed to start:", error);
  process.exit(1);
}
