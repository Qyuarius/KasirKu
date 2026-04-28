import express from "express";
import { login, register } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register); // Biasanya protected, tapi kita buka dulu untuk setup awal

export default router;
