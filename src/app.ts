import ApiError from "./utils/ApiError";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import logger from "./utils/logger";
import morgan from "morgan";
import pool from "./db";
import passport from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";

const app = express();

passport.use(
  "jwt",
  new Strategy(
    {
      jwtFromRequest: (req: Request) => {
        const headerToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        return headerToken || req.cookies.accessToken;
      },
      secretOrKey: process.env.JWT_ACCESS_SECRET as string,
    },
    async (jwtPayload: any, done) => {
      try {
        const [users] = await pool.query(
          "SELECT * FROM user_misc WHERE id = ?",
          [jwtPayload.sub]
        );
        if (!Array.isArray(users) || users.length === 0) {
          return done(null, false);
        }
        return done(null, users[0]);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);
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
// CORS - who can access the API
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

//Routers import
import healthCheckRouter from "./routers/healthCheck.routers";
import AuthRouter from "./routers/Auth.routers";
import UserRouter from "./routers/UserRegistration.routers";

// Express middlewares
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

//Routes
app.use("/api/v1/health", healthCheckRouter);
app.use("/api/v1/users", UserRouter);
app.use("/api/v1/auth", AuthRouter);

//Error handlers
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.log("Error", err);
  res.json(new ApiError(err.status || 500, err.message));
});

export default app;
