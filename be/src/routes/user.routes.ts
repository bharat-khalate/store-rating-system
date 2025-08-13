import {
  authenticateUser,
  getAllStoreUsers,
  getAllSystemUsers,
  getAllUsers,
  getUserByUserId,
  register,
  updatePassword,
} from "../controller/user.controller";
import UserService from "../service/user.service";
import { Router } from "express";

const UserRouter = Router();

UserRouter.post("/register", register);
UserRouter.post("/login", authenticateUser);
UserRouter.get("/getAllUsers", getAllUsers);
UserRouter.get("/getUserById/:userId", getUserByUserId);
UserRouter.get("/getAllStoreUsers", getAllStoreUsers);
UserRouter.get("/getAllSystemUsers", getAllSystemUsers);
UserRouter.put("/update", updatePassword);

export default UserRouter;
