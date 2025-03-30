import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import logger from "./utils/logger";
import morgan from "morgan";

const app = express();

// Morgan middleware
const morganFormat = ":method :url :status :response-time ms";
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
import healthCheckRouter from "./routers/healthCheck.routers";
import UserRouter from "./routers/UserRegistration.routers";

// Express middlewares
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

//Routes
app.use("/api/v1/health", healthCheckRouter);
app.use("/api/v1/users", UserRouter);

//Error handlers

export default app;
