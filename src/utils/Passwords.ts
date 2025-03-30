import bcrypt from "bcrypt";
import ApiError from "./ApiError";

export const encryptedPassword = async (password: string) => {
  if (password) {
    const newPassword = await bcrypt.hash(password, 10);
    return newPassword;
  } else {
    throw new ApiError(400, "password is required");
  }
};

export const comparePassword = async (
  password: string,
  encryptedPassword: string
) => {
  const result = await bcrypt.compare(password, encryptedPassword);
  return result;
};
