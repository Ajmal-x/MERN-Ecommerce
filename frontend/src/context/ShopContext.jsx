import { createContext, useEffect, useState } from "react";
import { products as localProducts } from "../assets/assets";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ShopContextProvider = ({ children }) => {
  
  const [products, setProducts] = useState(localProducts);


  const [databaseProducts, setDatabaseProducts] = useState([]);

  
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  
  const [cartItems, setCartItems] = useState({});
  const [cartLoaded, setCartLoaded] = useState(false);

  const navigate = useNavigate();

  const currency = "$";
  const delivery_fee = 10;

  
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/product/list`
        );

        if (response.data.success) {
          const backendProducts = response.data.products || [];

 
          setDatabaseProducts(backendProducts);


          setProducts([
            ...localProducts,
            ...backendProducts,
          ]);
        } else {
          console.error(
            "Failed to load products:",
            response.data.message
          );
          setDatabaseProducts([]);

         
          setProducts(localProducts);
        }
      } catch (error) {
        console.error(
          "Error loading products:",
          error.response?.data || error.message
        );

       
        setDatabaseProducts([]);

       
        setProducts(localProducts);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    const loadCart = async () => {
      const token = localStorage.getItem("token");

      // Guest user
      if (!token) {
        try {
          const storedCartItems = JSON.parse(
            localStorage.getItem("cartItems") || "{}"
          );

          setCartItems(storedCartItems);
        } catch (error) {
          console.error("Error reading local cart:", error);
          setCartItems({});
        } finally {
          setCartLoaded(true);
        }

        return;
      }

      // Logged-in user
      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/cart`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setCartItems(response.data.cartData || {});
        } else {
          setCartItems({});
        }
      } catch (error) {
        console.error(
          "Error loading cart:",
          error.response?.data || error.message
        );

        // Fallback to local cart
        try {
          const storedCartItems = JSON.parse(
            localStorage.getItem("cartItems") || "{}"
          );

          setCartItems(storedCartItems);
        } catch {
          setCartItems({});
        }
      } finally {
        setCartLoaded(true);
      }
    };

    loadCart();
  }, []);

  // =========================
  // Save Cart
  // =========================

  useEffect(() => {
    if (!cartLoaded) return;

    const saveCart = async () => {
      const token = localStorage.getItem("token");

      // Always keep local copy
      localStorage.setItem(
        "cartItems",
        JSON.stringify(cartItems)
      );

      // Guest user
      if (!token) return;

      // Logged-in user
      try {
        await axios.put(
          `${BACKEND_URL}/api/cart`,
          {
            cartData: cartItems,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        console.error(
          "Error saving cart:",
          error.response?.data || error.message
        );
      }
    };

    saveCart();
  }, [cartItems, cartLoaded]);

  // =========================
  // Reload Cart After Login
  // =========================

  useEffect(() => {
    const handleUserUpdated = async () => {
      const token = localStorage.getItem("token");

      if (!token) return;

      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/cart`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setCartItems(response.data.cartData || {});
        }
      } catch (error) {
        console.error(
          "Error loading user cart:",
          error.response?.data || error.message
        );
      }
    };

    window.addEventListener(
      "userUpdated",
      handleUserUpdated
    );

    return () => {
      window.removeEventListener(
        "userUpdated",
        handleUserUpdated
      );
    };
  }, []);

  // =========================
  // Add To Cart
  // =========================

  const addToCart = (itemId, size) => {
    if (!size) {
      toast.error("Please select a size");
      return;
    }

    const cartData = structuredClone(cartItems);

    if (!cartData[itemId]) {
      cartData[itemId] = {};
    }

    if (cartData[itemId][size]) {
      cartData[itemId][size] += 1;
    } else {
      cartData[itemId][size] = 1;
    }

    setCartItems(cartData);

    toast.success("Item added to cart");
  };

  // =========================
  // Get Cart Count
  // =========================

  const getCartCount = () => {
    let totalCount = 0;

    for (const productId in cartItems) {
      for (const size in cartItems[productId]) {
        const quantity = cartItems[productId][size];

        if (quantity > 0) {
          totalCount += quantity;
        }
      }
    }

    return totalCount;
  };

  // =========================
  // Update Quantity
  // =========================

  const updateQuantity = (itemId, size, quantity) => {
    const cartData = structuredClone(cartItems);

    if (!cartData[itemId]) return;

    if (quantity <= 0) {
      delete cartData[itemId][size];

      // Remove product completely if no sizes remain
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }

      toast.success("Item removed from cart");
    } else {
      cartData[itemId][size] = quantity;
    }

    setCartItems(cartData);
  };

  // =========================
  // Get Cart Amount
  // =========================

  const getCartAmount = () => {
    let totalAmount = 0;

    for (const productId in cartItems) {
      const itemInfo = products.find(
        (product) =>
          product._id === productId ||
          product.id === productId
      );

      if (!itemInfo) continue;

      for (const size in cartItems[productId]) {
        const quantity = cartItems[productId][size];

        if (quantity > 0) {
          totalAmount += itemInfo.price * quantity;
        }
      }
    }

    return totalAmount;
  };

  // =========================
  // Context Value
  // =========================

  const value = {
    // Products
    products,
    databaseProducts,

    // General
    currency,
    delivery_fee,

    // Search
    search,
    setSearch,

    showSearch,
    setShowSearch,

    // Cart
    cartItems,
    setCartItems,

    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,

    // Navigation
    navigate,
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;