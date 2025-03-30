import { z } from "zod";

export const userInfoSchema = z.object({
  fname: z.string({ required_error: "Firstname is required" }).min(3, {
    message: "Firstname must be at least 3 characters long",
  }),
  lname: z.string({ required_error: "Lastname is required" }).min(3, {
    message: "Lastname must be at least 3 characters long",
  }),
  graduationYear: z
    .number({ required_error: "GraduationYear is required" })
    .int(),
  email: z.string({ required_error: "Email is required" }).email({
    message: "Email is not valid",
  }),
  password: z.string({ required_error: "Password is required" }).min(8, {
    message: "Password must be at least 8 characters long",
  }),
  contact: z.string({ required_error: "Contact number is required" }),
  role: z.enum(["student", "alumni", "admin"]).optional(),
});
