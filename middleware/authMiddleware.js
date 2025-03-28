const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  if (!req.cookies || !req.cookies.token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const token = req.cookies.token; // Get token from cookies
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = protect;
