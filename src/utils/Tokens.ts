import jwt from "jsonwebtoken";

export const generateRefreshToken = function (id: number, email: string) {
  if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error("JWT_REFRESH_SECRET is not defined");
  }
  return jwt.sign(
    {
      id: id,
      email: email,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "10d",
    }
  );
};
export const generateAccessToken = function (id: number, email: string) {
  if (!process.env.JWT_ACCESS_SECRET) {
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
