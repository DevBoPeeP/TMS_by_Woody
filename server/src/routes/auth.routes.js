import { Router } from "express";
import {
  createUser,
  verifyEmail,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  changePassword,
  deleteUser,
  getAllUsers,
} from "../controllers/auth.controllers.js";
import {
  ensureIsAuthenticated,
  adminMiddleware,
  creatorMiddleware,
} from "../middlewares/auth.middleware.js";
const router = Router();

router.post("/register", createUser);

router.post("/verify-email", verifyEmail);

router.post("/login", loginUser);

// router.get("/login-status", userLoginStatus);

router.post("/logout", logoutUser);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:resetPasswordToken", resetPassword);

// change password ---> user must be logged in
router.patch("/change-password", changePassword);

router.get("/protected-routes", ensureIsAuthenticated, (req, res) => {
  res.status(200).json({ message: "This is a protected route" });
});

// admin route
router.delete("/admin/users/:id", adminMiddleware, deleteUser);

// get all users
router.get("/admin/users", creatorMiddleware, getAllUsers);

export default router;
