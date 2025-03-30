"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const healthCheck_controllers_1 = require("../controllers/healthCheck.controllers");
const router = (0, express_1.Router)();
router.route("/").get(healthCheck_controllers_1.healthCheckController);
exports.default = router;
