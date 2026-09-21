import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const adminAuth = async (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized!",
      });
    }

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (!decodedToken.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token!",
      });
    }

    const admin = await userModel
      .findById(decodedToken.id)
      .select("-password");

    if (!admin || admin.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required!",
      });
    }

    req.admin = admin;

    next();
  } catch (error) {
    console.log("Error while authenticating admin:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default adminAuth;