import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const profileRouter = Router();
const userController = new UserController();

profileRouter.get("/", userController.getUser);
profileRouter.patch("/", userController.updateUser);
profileRouter.delete("/", userController.deleteUser);

export default profileRouter;
