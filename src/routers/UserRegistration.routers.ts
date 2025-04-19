import { Router } from "express";
import { createUser } from "../controllers/userInfo.controllers";
import { upload } from "../middlewares/multer.middleware";
const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
    },
    {
      name: "coverImage",
    },
  ]),
  createUser
);

export default router;
