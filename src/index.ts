import dotenv from "dotenv";
import app from "./app";
import logger from "./utils/logger";

dotenv.config({
  path: "./.env",
});

const port = process.env.PORT || 8001;

app.listen(port, () => {
  logger.info(`Server running on port: ${port}...`);
});
