import logger from "../config/loggerConfig";
import userModel from "../models/user.model";
import { Request, Response } from "express";
import { AuthUser } from "../types/user.types";

const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await userModel.getAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    logger.error(`getAllUsers error: ${error}`);

    res.status(500).json({
      success: false,
      error: "internal server error",
    });
  }
};

const getUser = async (req: Request, res: Response) => {
  try {
    const authUser:AuthUser | undefined = req.authUser;
    if (authUser == null) {
      throw new Unauthorized(
        "you do not have permission to perform this action"
      );
    }
    let userID = authUser.id;
    if (authUser.role == "admin") {
      userID = req.params.id;
    }
    const result = await userModel.getUserByID(userID);
    // if (result)
    res.status(200).json({ success: true, user: result.rows[0] });
  } catch (error) {
    logger.error(`getUser error: ${error}`);

    res.status(500).json({
      success: false,
      error: "internal server error",
    });
  }
};

const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const authUser: AuthUser | undefined  = req.authUser;
    if (authUser == null) {
      throw new Unauthorized(
        "you do not have permission to perform this action"
      );
    }
    let userID = authUser.id;
    if (authUser.role == "admin") {
      userID = req.params.id;
    }

    const user = userModel.updateUser(userID, req.body);
    res.status(200).json({ success: true, user });
    return;
  } catch (error) {
    logger.error(error);

    res.status(500).json({ success: false, error: "internal server error" });
  }
};

const deleteUser = async () => {};

export default { getAllUsers, getUser, updateUser, deleteUser };
