import "express-async-errors";
import { Router } from "express";

import authRouter from "./auth.route";
import healthRouter from "./health.route";
import expenseRouter from "./expense.route";
import currenciesRouter from "./currencies.route";
import { authorizeUser } from "../middleware/auth.middleware";
import profileRouter from "./userProfile.route";
import userRouter from "./user.route";

const router = Router();

router.get("/", (_, res) => {
  res.redirect("/api/docs");
});
router.use("/health", healthRouter);
router.use("/auth", authRouter);
router.use("/currencies", currenciesRouter);

router.use(authorizeUser);

router.use("/profile", profileRouter);
router.use("/users", userRouter);
router.use("/expenses", expenseRouter);

export default router;
