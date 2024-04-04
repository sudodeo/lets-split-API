import userModel from "../models/user.model";
import { User } from "../types/user.types";

export class UserService {
  createUser = async (user: User) => {
    const newUser = userModel.createUser(user);
    return newUser;
  };

  listUsers = async () => {
    const users = userModel.listUsers();
    return users;
  };

  getUserByEmail = async (email: string) => {
    const user = userModel.getUserByEmail(email);
    return user;
  };

  getUserByID = async (id: string) => {
    const user = userModel.getUserByID(id);
    return user;
  };

  updateUser = async (id: string, user: User) => {
    const updatedUser = userModel.updateUser(id, user);
    return updatedUser;
  };

  deleteUser = async (id: string) => {
    const deletedUser = userModel.deleteUser(id);
    return deletedUser;
  };
}
