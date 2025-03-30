"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMiscSchema = void 0;
const zod_1 = require("zod");
exports.userMiscSchema = zod_1.z.object({
    branch: zod_1.z.string().optional(),
    achievement: zod_1.z
        .string()
        .min(10, {
        message: "Achievements must be at least 10 characters long",
    })
        .optional(),
    avatar: zod_1.z.string().optional(),
    coverImage: zod_1.z.string().optional(),
    hideContact: zod_1.z.boolean().optional(),
    refreshToken: zod_1.z.string().optional(),
});
