import { NextFunction, Request, Response } from "express";
import { userInfoSchema } from "../schemas/UserInfo.schema";
import { userMiscSchema } from "../schemas/UserMisc.schema";
import { encryptedPassword } from "../utils/Passwords";
import UserInfo from "../models/UserInfo.model";
import UserMisc from "../models/UserMisc.model";
import logger from "../utils/logger";
import ApiResponse from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary";
import { generateRefreshToken } from "../utils/Tokens";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  req.body.password = await encryptedPassword(req.body.password);
  req.body.graduationYear = Number(req.body.graduationYear);
  req.body.hideContact = Boolean(req.body.hideContact);

  const existedUser = await UserInfo.findByEmail(req.body.email);
  console.log(existedUser);

  // if (existedUser) {
  //   res.status(400).json(new ApiError(400, "User already exists"));
  //   return;
  // }

  const files = req.files as {
    avatar?: Express.Multer.File[];
    coverImage?: Express.Multer.File[];
  };

  const avatarLocalPath = files.avatar?.[0].path;
  const coverImageLocalPath = files.coverImage?.[0].path;
  let avatar;
  let coverImage;
  if (avatarLocalPath) {
    avatar = await uploadOnCloudinary(avatarLocalPath);
  }
  if (coverImageLocalPath) {
    coverImage = await uploadOnCloudinary(coverImageLocalPath);
  }
  req.body.avatar = avatar?.url;
  req.body.coverImage = coverImage?.url;

  console.log(req.body);
  try {
    const validatedUserInfo = userInfoSchema.safeParse(req.body);
    const validatedUserMisc = userMiscSchema.safeParse(req.body);

    if (!validatedUserInfo.success || !validatedUserMisc.success) {
      if (avatar) await deleteFromCloudinary(avatar.public_id);
      if (coverImage) await deleteFromCloudinary(coverImage.public_id);
      res.status(400).json(new ApiError(400, "Invalid data"));
      return;
    }
    const userInfo = (await UserInfo.create(validatedUserInfo.data)) as any;
    const refreshToken = generateRefreshToken(
      userInfo.insertId,
      req.body.email
    );
    await UserMisc.create({
      ...validatedUserMisc.data,
      id: userInfo.insertId,
      refreshToken: refreshToken,
    });

    logger.info("user created Successfully", userInfo);
    res.status(200).json(new ApiResponse(201, "User created Successfully"));
    next();
  } catch (error) {
    if (avatar) {
      await deleteFromCloudinary(avatar.public_id);
    }
    if (coverImage) {
      await deleteFromCloudinary(coverImage.public_id);
    }
    res.status(500).json(new ApiError(500, "Something went wrong"));
    logger.error("Error creating user", error);
    next(error);
  }
};
