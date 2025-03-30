"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = exports.generateRefreshToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateRefreshToken = function (id, email) {
    if (!process.env.JWT_REFRESH_SECRET) {
        throw new Error("JWT_REFRESH_SECRET is not defined");
    }
    return jsonwebtoken_1.default.sign({
        id: id,
        email: email,
    }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: "10d",
    });
};
exports.generateRefreshToken = generateRefreshToken;
const generateAccessToken = function (id, email) {
    if (!process.env.JWT_ACCESS_SECRET) {
        throw new Error("JWT_REFRESH_SECRET is not defined");
    }
    return jsonwebtoken_1.default.sign({
        id: id,
        email: email,
    }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: "1d",
    });
};
exports.generateAccessToken = generateAccessToken;
