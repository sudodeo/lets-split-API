const router = require("express").Router();

/**
 * @swagger
 *
 * /api/health:
 *  get:
 *    description: returns specific user details
 *    responses:
 *      200:
 *        description: successful request
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

module.exports = router;
