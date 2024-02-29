import "express-async-errors";
import { Router } from "express";

import authRoutes from "./auth.route";
import healthRoute from "./health.route";
import expenseRoutes from "./expense.route";
import currenciesRoute from "./currencies.route";

const router = Router();

router.use("/auth", authRoutes);
router.use("/expenses", expenseRoutes);
router.use("/health", healthRoute);
router.use("/currencies", currenciesRoute);

router.get("/", (_, res) => {
  res.redirect("/api/docs");
});

export default router;
