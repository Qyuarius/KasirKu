import express from "express";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../controllers/productController.js";
import { auth, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", auth, getProducts);
router.post("/", auth, adminOnly, createProduct);
router.patch("/:id", auth, adminOnly, updateProduct);
router.delete("/:id", auth, adminOnly, deleteProduct);

export default router;
