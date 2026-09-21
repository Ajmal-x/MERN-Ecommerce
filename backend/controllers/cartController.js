import userModel from "../models/userModel.js";

// Get user's cart
const getCart = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      cartData: user.cartData || {},
    });
  } catch (error) {
    console.log("Error while getting cart:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Save user's cart
const saveCart = async (req, res) => {
  try {
    const { cartData } = req.body;

    const user = await userModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.cartData = cartData;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Cart saved successfully",
    });
  } catch (error) {
    console.log("Error while saving cart:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { getCart, saveCart };