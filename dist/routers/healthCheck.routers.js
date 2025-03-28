"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const healthCheck_controllers_1 = __importDefault(require("../controllers/healthCheck.controllers"));
const router = (0, express_1.Router)();
router.route("./").get(healthCheck_controllers_1.default);
exports.default = router;
