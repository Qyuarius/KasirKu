import express from "express";
import { getUsers, createUser, toggleUserStatus, resetPassword } from "../controllers/userController.js";
import { auth, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", auth, adminOnly, getUsers);
router.post("/", auth, adminOnly, createUser);
router.patch("/:id/toggle", auth, adminOnly, toggleUserStatus);
router.patch("/:id/reset-password", auth, adminOnly, resetPassword);

export default router;
