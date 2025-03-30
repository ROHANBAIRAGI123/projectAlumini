"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const UserInfo_schema_1 = require("../schemas/UserInfo.schema");
const UserInfo_model_1 = __importDefault(require("../models/UserInfo.model"));
const logger_1 = __importDefault(require("../utils/logger"));
const ApiResponse_1 = __importDefault(require("../utils/ApiResponse"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const Passwords_1 = require("../utils/Passwords");
const UserMisc_schema_1 = require("../schemas/UserMisc.schema");
const UserMisc_model_1 = __importDefault(require("../models/UserMisc.model"));
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    req.body.password = yield (0, Passwords_1.encryptedPassword)(req.body.password);
    req.body.graduationYear = Number(req.body.graduationYear);
    req.body.hideContact = Boolean(req.body.hideContact);
    console.log(req.body);
    const validatedUserInfo = UserInfo_schema_1.userInfoSchema.safeParse(req.body);
    const validatedUserMisc = UserMisc_schema_1.userMiscSchema.safeParse(req.body);
    if (validatedUserInfo.success) {
        const userInfo = (yield UserInfo_model_1.default.create(validatedUserInfo.data));
        console.log(userInfo);
        yield UserMisc_model_1.default.create(Object.assign(Object.assign({}, validatedUserMisc.data), { id: userInfo.insertId }));
        logger_1.default.info("user created Successfully");
        res.status(200).json(new ApiResponse_1.default(201, "User created Successfully"));
    }
    else {
        res.status(401).json(new ApiError_1.default(401, "Bad Credentials"));
        next();
    }
});
exports.createUser = createUser;
