import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
  try {
    const { orderItems, totalPrice, paymentMethod, userId } = req.body;
    const order = await Order.create({
      user: userId,
      orderItems,
      totalPrice,
      paymentMethod
    });
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};