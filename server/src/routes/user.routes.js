import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask,
} from "../controllers/task.controllers.js";
import { ensureIsAuthenticated } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/task/create", createTask);
router.get("/tasks", getTasks);
router.get("/task/:id", getTask);
router.patch("/task/:id", updateTask);
router.delete("/task/:id", deleteTask);

router.get("/protected-routes", ensureIsAuthenticated, (req, res) => {
  res.status(200).json({ message: "This is a protected route" });
});

export default router;
