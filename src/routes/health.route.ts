import { Router } from "express";

const router = Router();

router.get("/", (_, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    message: "API is healthy",
    uptime: Math.floor(process.uptime()) + " seconds",
    timestamp: new Date().toISOString(),
  });
});

export default router;
