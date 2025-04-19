import { Router } from "express";
import {
  login,
  logout,
  refreshAccessToken,
} from "../controllers/auth.controllers";
const router = Router();

router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/token").post(refreshAccessToken); // currently not working

export default router;
