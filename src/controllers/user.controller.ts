import logger from "../config/loggerConfig";
import userModel from "../models/user.model";
import { Request, Response } from "express";

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
    const result = await userModel.getUser(req.body.email);
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
    const user = userModel.updateUser(req.body);
    res.status(200).json({ success: true, user });
    return;
  } catch (error) {
    logger.error(error);

    res.status(500).json({ success: false, error: "internal server error" });
  }
};

const deleteUser = async () => {};

export default { getAllUsers, getUser, updateUser, deleteUser };
