import { Router } from "express";

const router = Router();

/**
 * @swagger
 *
 * /api/health:
 *  get:
 *    summary: Returns API health status
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: successful request
 *        content:
 *          application/json:
 *            example:
 *              {
 *                 "status": "ok",
 *                 "message": "API is healthy",
 *                 "uptime": "11 seconds",
 *                 "timestamp": "2023-12-25T21:19:20.103Z"
 *                 }
 *
 */
router.get("/", (_, res) => {
  res.status(200).json({
    status: "ok",
    message: "API is healthy",
    uptime: Math.floor(process.uptime()) + " seconds",
    timestamp: new Date().toISOString(),
  });
});

export default router;
