import jwt from "jsonwebtoken";
import logger from "./logger";
import pool from "../db/index";
import dotenv from "dotenv";
dotenv.config();

export const generateRefreshToken = function (id: number, email: string) {
  if (!process.env.JWT_REFRESH_SECRET) {
    logger.error("JWT_REFRESH_SECRET is not defined in generateRefreshToken");
    throw new Error("JWT_REFRESH_SECRET is not defined");
  }
  return jwt.sign(
    //payload
    {
      id: id,
      email: email,
    },
    //secret
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "10d",
    }
  );
};
export const generateAccessToken = function (id: number, email: string) {
  if (!process.env.JWT_ACCESS_SECRET) {
    logger.error("JWT_ACCESS_SECRET is not defined in generateAccessToken");
    throw new Error("JWT_REFRESH_SECRET is not defined");
  }
  return jwt.sign(
    {
      id: id,
      email: email,
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

export const saveRefreshToken = async (
  userId: number,
  token: string
): Promise<void> => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 10); // 10 days expiry

  await pool.query(
    "INSERT INTO user_misc (id, refreshToken, expiresAt) VALUES (?, ?, ?)",
    [userId, token, expiresAt]
  );
};

export const verifyRefreshToken = async (token: string) => {
  try {
    if (!process.env.JWT_REFRESH_SECRET) {
      logger.error("JWT_REFRESH_SECRET is not defined in verifyRefreshToken");
    }

    // Verify token signature
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string);

    // Check if token exists in database
    const [tokens] = await pool.query(
      "SELECT * FROM user_misc WHERE refreshToken = ? AND id = ? AND expiresAt > NOW()",
      [token, payload.sub]
    );

    if (Array.isArray(tokens) && tokens.length === 0) {
      logger.error("Token not found in database");
      return null;
    }
    logger.info("Token verified", payload);
    return payload;
  } catch (error) {
    logger.error("error occured", error);
    return null;
  }
};
