import { Router } from "express";
import userController from "../controllers/user.controller";

const userRouter = Router();

// admin routes
userRouter.get("/:id", userController.getUser);

userRouter.delete("/:id", userController.deleteUser);

userRouter.patch("/:id", userController.updateUser);

export default userRouter;
