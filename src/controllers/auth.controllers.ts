import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import logger from "../utils/logger";
import ApiError from "../utils/ApiError";
import UserInfo from "../models/UserInfo.model";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
  generateRefreshToken,
  generateAccessToken,
  saveRefreshToken,
} from "../utils/Tokens";
import ApiResponse from "../utils/ApiResponse";
import UserMisc from "../models/UserMisc.model";

dotenv.config();

export const login = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    if (!email || !password) {
      logger.error("email and password are required");
      throw new ApiError(400, "email and password are required");
    }
    const [user] = (await UserInfo.findByEmail(email)) as any;
    if (!user) {
      logger.error("user not found");
      throw new ApiError(404, "user not found");
    }
    console.log(user);
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        console.log(user.password);
        logger.error("error comparing password", err);
        throw new ApiError(500, "error comparing password");
      }
      if (result) {
        const accessToken = generateAccessToken(user.id, user.email);
        const refreshToken = generateRefreshToken(user.id, user.email);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 10);
        saveRefreshToken(user.id, refreshToken);
        const options = { httpOnly: true };
        res
          .status(201)
          .cookie("refreshToken", refreshToken, options)
          .cookie("accessToken", accessToken, options)
          .json(new ApiResponse(201, "user logged in successfully", user));
      }
    });
  } catch (error) {
    logger.error("error login user", error);
    throw new ApiError(500, "error login user");
  }
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  try {
    if (!req.cookies.refreshToken) {
      logger.error("refresh token not found");
      throw new ApiError(401, "refresh token not found in logout");
    }

    if (req.user && "email" in req.user) {
      const userEmail = req.user.email as string;
      const user = (await UserInfo.findByEmail(userEmail)) as any;
      if (user) {
        const id = user[0].id;
        await UserMisc.updateUser(id, { refreshToken: null });
        logger.info("user refresh token removed from db ");
      }
    }
    const options = { httpOnly: true };
    res.clearCookie("refreshToken", options);
    res.clearCookie("accessToken", options);
    res.status(200).json(new ApiResponse(200, "user logged out successfully"));
  } catch (error) {
    logger.error("error logout user", error);
    throw new ApiError(500, "error logout user");
  }
});

export const refreshAccessToken = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const refreshToken =
        req.cookies.refreshToken ||
        req.header("Authorization")?.replace("Bearer ", "");
      if (!refreshToken) {
        logger.error("refresh token not found");
        throw new ApiError(401, "refresh token not found");
      }
      // verify refresh token
      const payload = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string
      ) as jwt.JwtPayload;
      if (!payload) {
        logger.error("invalid or expired refresh token");
        res.clearCookie("refreshToken");
        res.clearCookie("accessToken");
        throw new ApiError(401, "invalid or expired refresh token");
      }
      console.log(payload);
      const [user] = (await UserMisc.findById(payload.id)) as any;
      console.log(user);
      if (!user) {
        logger.error("user not found");
        throw new ApiError(404, "user not found");
      }
      if (refreshToken !== user.refreshToken) {
        logger.error("invalid refresh token");
        throw new ApiError(401, "invalid refresh token");
      }
      const accessToken = generateAccessToken(user.id, user.email);
      const options = { httpOnly: true };
      res
        .status(201)
        .cookie("accessToken", accessToken, options)
        .json(new ApiResponse(201, "access token refreshed successfully"));
    } catch (error) {
      logger.error("error refreshing access token", error);
      throw new ApiError(500, "error refreshing access token");
    }
  }
);
