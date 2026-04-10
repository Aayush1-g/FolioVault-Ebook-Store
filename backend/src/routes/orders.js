import express from "express";
import { createOrder, getMyOrders } from "../controllers/ordersController.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/user/:userId", getMyOrders);

export default router;