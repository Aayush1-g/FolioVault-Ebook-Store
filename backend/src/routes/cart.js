import express from "express";
import { getCart, addToCart, removeFromCart } from "../controllers/cartController.js";

const router = express.Router();

// These endpoints match common frontend fetch calls
router.get("/:userId", getCart);
router.post("/add", addToCart);
router.delete("/remove/:userId/:bookId", removeFromCart);

export default router; // THIS LINE FIXES YOUR ERROR