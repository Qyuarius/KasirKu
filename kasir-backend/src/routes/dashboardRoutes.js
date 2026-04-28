import express from "express";
import { getStats } from "../controllers/dashboardController.js";
import { auth, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", auth, adminOnly, getStats);

export default router;
