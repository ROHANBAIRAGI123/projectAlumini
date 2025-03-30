import { NextFunction, Request, Response } from "express";
import { userInfoSchema } from "../schemas/UserInfo.schema";
import UserInfo from "../models/UserInfo.model";
import logger from "../utils/logger";
import ApiResponse from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";
import { encryptedPassword } from "../utils/Passwords";
import { userMiscSchema } from "../schemas/UserMisc.schema";
import UserMisc from "../models/UserMisc.model";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.body.password = await encryptedPassword(req.body.password);
  req.body.graduationYear = Number(req.body.graduationYear);
  req.body.hideContact = Boolean(req.body.hideContact);

  console.log(req.body);
  const validatedUserInfo = userInfoSchema.safeParse(req.body);
  const validatedUserMisc = userMiscSchema.safeParse(req.body);
  if (validatedUserInfo.success) {
    const userInfo = (await UserInfo.create(validatedUserInfo.data)) as any;
    console.log(userInfo);
    await UserMisc.create({ ...validatedUserMisc.data, id: userInfo.insertId });
    logger.info("user created Successfully");
    res.status(200).json(new ApiResponse(201, "User created Successfully"));
  } else {
    res.status(401).json(new ApiError(401, "Bad Credentials"));
    next();
  }
};
