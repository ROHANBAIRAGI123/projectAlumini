"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userInfo_controllers_1 = require("../controllers/userInfo.controllers");
const multer_middleware_1 = require("../middlewares/multer.middleware");
const router = (0, express_1.Router)();
router.route("/create").post(multer_middleware_1.upload.fields([
    {
        name: "avatar",
    },
    {
        name: "coverImage",
    },
]), userInfo_controllers_1.createUser);
exports.default = router;
