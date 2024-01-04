import logger from "../config/loggerConfig.js";
import userModel from "../models/user.model.js";

const getAllUsers = async (req, res) => {
  try {
    const result = await userModel.getAllUsers();
    res.status(200).json({ success: true, data: result.users });
  } catch (error) {
    res.status(500).json({
      message: "error occured, could not fetch users",
    });

    logger.error(`getAllUsers error: ${error}`);
  }
};

const getUser = async (req, res) => {
  try {
    const result = await userModel.getUser(req.body.email);
    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({
      message: "error occured, could not create user",
    });
    logger.error(`getUser error: ${error}`);
  }
};

const editUser = async (req, res) => {
  try {
    const user = userModel.editUser(req.body);
    return res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: "internal server error" });
  }
};

const deleteUser = async () => {};

export default { getAllUsers, getUser, editUser, deleteUser };
