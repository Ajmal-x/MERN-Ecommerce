import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import userModel from "../models/userModel.js";

// INFO: Function to create token
const createToken = (id, role = "user") => {
  return jwt.sign(
    {
      id,
      role,
    },
    process.env.JWT_SECRET
  );
};

// INFO: Route for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = createToken(user._id, user.role);

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("Error while logging in user:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// INFO: Route for user registration
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    const userExists = await userModel.findOne({
      email: normalizedEmail,
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    if (!validator.isEmail(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    }

    if (!password || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: "user",
    });

    const user = await newUser.save();

    const token = createToken(user._id, user.role);

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("Error while registering user:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// INFO: Route for admin login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    console.log("========== ADMIN LOGIN ==========");
    console.log("Email:", normalizedEmail);

    // INFO: Find admin in users collection
    const admin = await userModel.findOne({
      email: normalizedEmail,
      role: "admin",
    });

    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "Invalid admin email or password",
      });
    }

    // INFO: Compare password with hashed password in database
    const isPasswordCorrect = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Invalid admin email or password",
      });
    }

    // INFO: Create admin token
    const token = createToken(admin._id, "admin");

    console.log("Admin login successful:", admin.email);

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.log("Error while authenticating admin:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// INFO: Get admin profile
const getAdminProfile = async (req, res) => {
  try {
    const admin = await userModel
      .findById(req.admin._id)
      .select("-password");

    if (!admin || admin.role !== "admin") {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      user: admin,
    });
  } catch (error) {
    console.log("Error while getting admin profile:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// INFO: Update admin profile
const updateAdminProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const admin = await userModel.findById(req.admin._id);

    if (!admin || admin.role !== "admin") {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const emailExists = await userModel.findOne({
      email: normalizedEmail,
      _id: { $ne: admin._id },
    });

    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: "Email is already in use",
      });
    }

    admin.name = name.trim();
    admin.email = normalizedEmail;

    await admin.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.log("Error while updating admin profile:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// INFO: Change admin password
const changeAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const admin = await userModel.findById(req.admin._id);

    if (!admin || admin.role !== "admin") {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters",
      });
    }

    // INFO: Verify current password
    const isCurrentPasswordCorrect = await bcrypt.compare(
      currentPassword,
      admin.password
    );

    if (!isCurrentPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // INFO: Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(
      newPassword,
      salt
    );

    admin.password = hashedPassword;

    await admin.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log("Error while changing admin password:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  loginUser,
  registerUser,
  loginAdmin,
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
};