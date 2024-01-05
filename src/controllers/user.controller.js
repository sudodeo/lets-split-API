import logger from "../config/loggerConfig.js";
import userModel from "../models/user.model.js";

const getAllUsers = async (req, res) => {
  try {
    const result = await userModel.getAllUsers();
    res.status(200).json({ success: true, data: result.users });
  } catch (error) {
    logger.error(`getAllUsers error: ${error}`);

    res.status(500).json({
      success: false,
      error: "internal server error",
    });
  }
};

const getUser = async (req, res) => {
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

const updateUser = async (req, res) => {
  try {
    const user = userModel.updateUser(req.body);
    return res.status(200).json({ success: true, user });
  } catch (error) {
    logger.error(error);

    res.status(500).json({ success: false, error: "internal server error" });
  }
};

const deleteUser = async () => {};

export default { getAllUsers, getUser, updateUser, deleteUser };
