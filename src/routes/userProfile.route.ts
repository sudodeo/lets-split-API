import {Router} from "express"
import userController from "../controllers/user.controller"

const profileRouter = Router()

profileRouter.get("/", userController.getUser)
profileRouter.patch("/", userController.updateUser)
profileRouter.delete("/",userController.deleteUser)

export default profileRouter