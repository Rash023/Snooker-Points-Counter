const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.authMiddleWare = async (req, res, next) => {
  try {
    const authHeader = req.header["Authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).json({
        success: false,
        message: "Authorization header missing or malformed",
      });
    }

    const token = authHeader.replace("Bearer ", "").trim();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.userId) {
      req.userId = decoded.userId;
      next();
    }
  } catch {
    return res.status(403).json({
      success: false,
      message: "Invalid token",
    });
  }
};
