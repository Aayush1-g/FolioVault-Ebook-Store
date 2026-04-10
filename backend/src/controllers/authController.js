import User from "../models/User.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      isAdmin
    });

    const responseData = {
      _id: user._id,
      name: user.name || user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      token: user.generateAuthToken()
    };

    console.log("Register Response:", responseData);

    res.status(201).json(responseData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // 1. Check if user exists
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // 2. Check if password is correct
    const isMatch = await user.comparePassword(password);

    if (isMatch) {
      const responseData = {
        _id: user._id,
        name: user.name || user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        token: user.generateAuthToken()
      };

      return res.json(responseData);
    } else {
      // CHANGE HERE: This triggers if the email was right but password was wrong
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};