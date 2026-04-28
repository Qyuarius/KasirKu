import express from "express";
import { createTransaction, getTransactions } from "../controllers/transactionController.js";
import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", auth, createTransaction);
router.get("/", auth, getTransactions);

export default router;
