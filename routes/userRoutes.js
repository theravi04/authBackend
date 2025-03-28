const express = require("express");
const { getProfile, updateProfile } = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", protect, getProfile);
router.put("/profileUpdate", protect, updateProfile);

module.exports = router;
