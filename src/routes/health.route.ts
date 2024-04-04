import { Router } from "express";
import { HttpCode } from "../middleware/error.middleware";

const router = Router();

router.get("/", (_, res) => {
  res.status(HttpCode.OK).json({
    success: true,
    status: "ok",
    message: "API is healthy",
    uptime: Math.floor(process.uptime()) + " seconds",
    timestamp: new Date().toISOString(),
  });
});

export default router;
