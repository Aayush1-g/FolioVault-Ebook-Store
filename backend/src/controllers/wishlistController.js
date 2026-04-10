import User from "../models/User.js"; // We can store wishlist directly in User model or a separate one

export const getWishlist = async (req, res) => {
  try {
    // Assuming you added a 'wishlist' array field to your User model
    const user = await User.findById(req.params.userId).populate("wishlist");
    res.json(user.wishlist || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleWishlist = async (req, res) => {
  const { userId, bookId } = req.body;
  try {
    const user = await User.findById(userId);
    const isWishlisted = user.wishlist.includes(bookId);

    if (isWishlisted) {
      user.wishlist = user.wishlist.filter(id => id.toString() !== bookId);
    } else {
      user.wishlist.push(bookId);
    }
    
    await user.save();
    res.json(user.wishlist);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};