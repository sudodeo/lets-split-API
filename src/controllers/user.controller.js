import logger from "../config/loggerConfig.js";
import userModel from "../models/user.model.js";
import userService from "../services/user.service.js";
import { validationResult } from "express-validator";

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

const createUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if (req.body.password != req.body.confirmPassword) {
      return res.status(400).json({
        success: false,
        error: "password and confirmPassword do not match",
      });
    }

    const existingUser = await userModel.getUser(req.body.email);
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, error: "user already exists" });
    }

    const user = await userService.registerUser(req.body);

    // Convert to local time zone and format the date as YYYY-MM-DD, because for some reason, node-postgres converts the date to UTC when it reads  from the database
    user.dob = new Date(user.dob).toLocaleDateString("en-CA");

    // don't send hashed password to client
    delete user.password;

    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({
      message: "error occured, could not create user",
    });
    logger.error(`createUser error: ${error}`);
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

export default { getAllUsers, getUser, editUser, createUser, deleteUser };
