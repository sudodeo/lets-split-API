import "express-async-errors";
import { Router } from "express";

import authRoutes from "./auth.route";
import healthRoute from "./health.route";
import expenseRoutes from "./expense.route";
import currenciesRoute from "./currencies.route";
import authMiddleware from "../middleware/auth.middleware";

const router = Router();

router.use("/health", healthRoute);
router.use("/auth", authRoutes);
router.use("/currencies", currenciesRoute);
router.use(authMiddleware.authenticateToken);
router.use("/expenses", expenseRoutes);

router.get("/", (_, res) => {
  res.redirect("/api/docs");
});

export default router;
