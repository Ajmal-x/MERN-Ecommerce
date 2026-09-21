import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import Login from "./components/Login";
import Edit from "./pages/Edit";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const currency = (price) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Slide}
      />

      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <div className="min-h-screen">
          {/* Top Navbar */}
          <Navbar setToken={setToken} />

          {/* Main Layout */}
          <div className="flex min-h-[calc(100vh-80px)]">
            {/* Sidebar */}
            <Sidebar />

            {/* Page Content */}
            <main className="min-w-0 flex-1 px-5 py-6 sm:px-8 lg:px-10">
              <div className="mx-auto w-full max-w-7xl">
                <Routes>
                  <Route path="/" element={<Dashboard token={token} />} />

                  <Route path="/add" element={<Add token={token} />} />

                  <Route path="/list" element={<List token={token} />} />

                  <Route path="/edit/:id" element={<Edit token={token} />} />

                  <Route path="/orders" element={<Orders token={token} />} />

                  <Route path="/settings" element={<Settings />} />

                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </div>
            </main>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
