// userService.js
import userModel from "../models/user.model.js";
import { User } from "../types/user.types.js";

const updateUserProfile = async (newProfileData: User) => {
  return userModel.updateUser(newProfileData);
};

export default {
  updateUserProfile,
};
