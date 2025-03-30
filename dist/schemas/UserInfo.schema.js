"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userInfoSchema = void 0;
const zod_1 = require("zod");
exports.userInfoSchema = zod_1.z.object({
    fname: zod_1.z.string({ required_error: "Firstname is required" }).min(3, {
        message: "Firstname must be at least 3 characters long",
    }),
    lname: zod_1.z.string({ required_error: "Lastname is required" }).min(3, {
        message: "Lastname must be at least 3 characters long",
    }),
    graduationYear: zod_1.z
        .number({ required_error: "GraduationYear is required" })
        .int(),
    email: zod_1.z.string({ required_error: "Email is required" }).email({
        message: "Email is not valid",
    }),
    password: zod_1.z.string({ required_error: "Password is required" }).min(8, {
        message: "Password must be at least 8 characters long",
    }),
    contact: zod_1.z.string({ required_error: "Contact number is required" }),
    role: zod_1.z.enum(["student", "alumni", "admin"]).optional(),
});
