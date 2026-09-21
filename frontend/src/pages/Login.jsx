import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";

const Login = () => {
  const [currentState, setCurrentState] = useState("Sign Up");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

const from = location.state?.from || "/";

  const isLogin = currentState === "Login";

  const switchMode = () => {
    setCurrentState(isLogin ? "Sign Up" : "Login");

    setName("");
    setPassword("");
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    try {
      setLoading(true);

      const endpoint = isLogin ? "login" : "register";

      const payload = isLogin
        ? {
            email: email.trim(),
            password,
          }
        : {
            name: name.trim(),
            email: email.trim(),
            password,
          };

      const response = await axios.post(
        `http://localhost:4000/api/user/${endpoint}`,
        payload
      );

      if (!response.data.success) {
        toast.error(
          response.data.message || "Something went wrong"
        );
        return;
      }

      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
      }

      if (user) {
        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );

        window.dispatchEvent(
          new Event("userUpdated")
        );
      }

      toast.success(
        isLogin
          ? "Login successful"
          : "Account created successfully"
      );

     navigate(from, { replace: true });
    } catch (error) {
      console.error(
        "Authentication error:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-80px)] px-4 py-12 sm:py-16">
      <div className="mx-auto w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3">
            <h1 className="prata-regular text-3xl text-gray-900 sm:text-4xl">
              {currentState}
            </h1>

            <span className="h-px w-8 bg-gray-900" />
          </div>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            {isLogin
              ? "Welcome back. Sign in to continue shopping."
              : "Create your Trendify account and start shopping."}
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={onSubmitHandler}
          className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
        >
          {/* Name */}
          {!isLogin && (
            <div className="mb-5">
              <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500">
                Full Name
              </label>

              <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 px-4 transition focus-within:border-gray-500 focus-within:bg-white">
                <UserRound
                  size={17}
                  strokeWidth={1.7}
                  className="shrink-0 text-gray-400"
                />

                <input
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400"
                  placeholder="John Doe"
                  autoComplete="name"
                  required
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="mb-5">
            <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500">
              Email Address
            </label>

            <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 px-4 transition focus-within:border-gray-500 focus-within:bg-white">
              <Mail
                size={17}
                strokeWidth={1.7}
                className="shrink-0 text-gray-400"
              />

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400"
                placeholder="hello@gmail.com"
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500">
              Password
            </label>

            <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 px-4 transition focus-within:border-gray-500 focus-within:bg-white">
              <LockKeyhole
                size={17}
                strokeWidth={1.7}
                className="shrink-0 text-gray-400"
              />

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400"
                placeholder="••••••••"
                autoComplete={
                  isLogin
                    ? "current-password"
                    : "new-password"
                }
                minLength={8}
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((prev) => !prev)
                }
                className="shrink-0 text-gray-400 transition hover:text-gray-700"
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff size={17} />
                ) : (
                  <Eye size={17} />
                )}
              </button>
            </div>

            {!isLogin && (
              <p className="mt-2 text-xs text-gray-400">
                Password must contain at least 8 characters.
              </p>
            )}
          </div>

          {/* Options */}
          <div className="mt-5 flex items-center justify-between gap-4 text-xs sm:text-sm">
            <button
              type="button"
              disabled
              className="cursor-not-allowed text-gray-400"
            >
              Forgot password?
            </button>

            <button
              type="button"
              onClick={switchMode}
              className="font-medium text-gray-700 transition hover:text-black"
            >
              {isLogin
                ? "Create an account"
                : "Login here"}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="group mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-black px-6 py-3.5 text-sm font-medium text-white transition hover:bg-gray-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <span>
                {isLogin
                  ? "SIGNING IN..."
                  : "CREATING ACCOUNT..."}
              </span>
            ) : (
              <>
                <span>
                  {isLogin ? "SIGN IN" : "CREATE ACCOUNT"}
                </span>

                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </>
            )}
          </button>
        </form>

        {/* Bottom Text */}
        <p className="mt-6 text-center text-xs leading-5 text-gray-400">
          By continuing, you agree to our terms and
          conditions.
        </p>
      </div>
    </section>
  );
};

export default Login;