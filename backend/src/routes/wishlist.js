import express from "express";
import { getWishlist, toggleWishlist } from "../controllers/wishlistController.js";

const router = express.Router();

router.get("/:userId", getWishlist);
router.post("/toggle", toggleWishlist);

export default router; // Missing this causes the SyntaxError