import { NextFunction, Request, Response } from "express";
import { userInfoSchema } from "../schemas/UserInfo.schema";
import { userMiscSchema } from "../schemas/UserMisc.schema";
import { encryptedPassword } from "../utils/Passwords";
import UserInfo from "../models/UserInfo.model";
import UserMisc from "../models/UserMisc.model";
import logger from "../utils/logger";
import ApiResponse from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary";
import { generateRefreshToken } from "../utils/Tokens";

// Create user/ register user
export const createUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    //encrypt the password
    req.body.password = await encryptedPassword(req.body.password);
    req.body.graduationYear = Number(req.body.graduationYear);
    req.body.hideContact = Boolean(req.body.hideContact);

    // check if user already exists
    // const existedUser = await UserInfo.findByEmail(req.body.email);
    // console.log(existedUser);

    // if (!existedUser) {
    //   res.status(400).json(new ApiError(400, "User already exists"));
    //   logger.error("User already exists", existedUser);
    //   return;
    // }

    // upload avatar and cover image
    const files = req.files as {
      avatar?: Express.Multer.File[];
      coverImage?: Express.Multer.File[];
    };

    // extract local path
    const avatarLocalPath = files.avatar?.[0].path;
    const coverImageLocalPath = files.coverImage?.[0].path;
    let avatar;
    let coverImage;

    // upload on cloudinary
    if (avatarLocalPath) {
      avatar = await uploadOnCloudinary(avatarLocalPath);
    }
    if (coverImageLocalPath) {
      coverImage = await uploadOnCloudinary(coverImageLocalPath);
    }
    // set avatar and cover image
    req.body.avatar = avatar?.url;
    req.body.coverImage = coverImage?.url;

    console.log(req.body);
    try {
      // validation with zod
      const validatedUserInfo = userInfoSchema.safeParse(req.body);
      const validatedUserMisc = userMiscSchema.safeParse(req.body);

      // if validation fails delete avatar and cover image
      if (!validatedUserInfo.success || !validatedUserMisc.success) {
        if (avatar) await deleteFromCloudinary(avatar.public_id);
        if (coverImage) await deleteFromCloudinary(coverImage.public_id);
        logger.error("Invalid data", validatedUserInfo.error);
        res.status(400).json(new ApiError(400, "Invalid data"));
        return;
      }
      // add data to database
      const userInfo = (await UserInfo.create(validatedUserInfo.data)) as any;
      const refreshToken = generateRefreshToken(
        userInfo.insertId,
        req.body.email
      );
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 10);

      await UserMisc.create({
        ...validatedUserMisc.data,
        id: userInfo.insertId,
        refreshToken: refreshToken,
        expiresAt: expiresAt,
      });

      logger.info("user created Successfully", userInfo);
      res.status(200).json(new ApiResponse(201, "User created Successfully"));
    } catch (error) {
      // delete avatar and cover image
      if (avatar) {
        await deleteFromCloudinary(avatar.public_id);
      }
      if (coverImage) {
        await deleteFromCloudinary(coverImage.public_id);
      }
      logger.error("Error creating user", error);
      // pass error to next middleware
      next(error);
    }
  }
);
