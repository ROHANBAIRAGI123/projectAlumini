import asyncHandler from "../utils/asyncHandler";
import logger from "../utils/logger";
import { Request, Response } from "express";

const healthCheckController = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info("Health check successful", req, res);
    res.status(201).json({ message: "Health check successful" });
  }
);

export default healthCheckController;
