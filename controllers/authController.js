const User = require("../models/User");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateToken");

const registerUser = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;

    if (!name || !email || !password || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password, address });

    return res
      .status(201)
      .json({ message: "User registered successfully", user });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Find user in database
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // Generate JWT token
  const token = generateToken(user._id);

  // Send token as HTTP-Only Cookie
  res.cookie("token", token, {
    httpOnly: true, // Prevents JavaScript access (more secure)
    secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
    sameSite: "strict", // Protects against CSRF attacks
    maxAge: 60 * 60 * 1000, // 1 hour
  });

  res.json({
    message: "Login successful",
    user: { id: user._id, name: user.name, email: user.email },
  });
};

module.exports = { registerUser, loginUser };
