import { Router } from "express";
import {
  createUser,
  verifyEmail,
  loginUser,
} from "../controllers/auth.controllers.js";
import { ensureIsAuthenticated } from "../middlewares/auth.middleware.js";
const router = Router();

router.post("/create-user", createUser);

router.post("/verify-email", verifyEmail);

router.post("./login", loginUser);

router.get("/protected-routes", ensureIsAuthenticated, (req, res) => {
  res.status(200).json({ message: "This is a protected route" });
});

export default router;
