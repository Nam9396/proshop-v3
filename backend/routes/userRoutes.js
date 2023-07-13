import express from "express";
import { authUser, deleteUser, getUserById, getUserProfile, getUsers, logoutUser, registerUser, updateUser, updateUserProfile } from "../controllers/userController.js";
import { admin, protect } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.route('/').get(protect, admin, getUsers);

userRouter.route('/register').post(registerUser);

userRouter.post('/auth', authUser);

userRouter.post('/logout', logoutUser);

userRouter.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

userRouter.route('/:id')
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser);

export default userRouter;