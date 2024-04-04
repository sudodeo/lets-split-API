import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const userRouter = Router();
const userController = new UserController();

// admin routes
userRouter.get("/:id", userController.getUser);

userRouter.delete("/:id", userController.deleteUser);

userRouter.patch("/:id", userController.updateUser);

export default userRouter;
