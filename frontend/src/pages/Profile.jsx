import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserRound,
  Mail,
  Package,
  LogOut,
  ArrowRight,
} from "lucide-react";
import { toast } from "react-toastify";

const Profile = () => {
  const navigate = useNavigate();

  let user = null;

  try {
    const savedUser = localStorage.getItem("user");
    user = savedUser ? JSON.parse(savedUser) : null;
  } catch (error) {
    console.error("Invalid user data:", error);
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.setItem(
      "cartItems",
      JSON.stringify({})
    );

    window.dispatchEvent(new Event("userUpdated"));

    toast.success("Logged out successfully");

    navigate("/");
  };

  if (!user) {
    return (
      <section className="flex min-h-[500px] items-center justify-center px-6">
        <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-gray-50 p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
            <UserRound
              size={26}
              className="text-gray-500"
            />
          </div>

          <h1 className="mt-5 text-xl font-semibold text-gray-900">
            You're not logged in
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Please log in to view your profile.
          </p>

          <Link
            to="/login"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Login
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    );
  }

  const firstLetter =
    user.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <section className="border-t border-gray-100 px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-4xl">
        {/* Page Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-3">
            <h1 className="prata-regular text-3xl text-gray-900 sm:text-4xl">
              MY PROFILE
            </h1>

            <span className="h-px w-8 bg-gray-900" />
          </div>

          <p className="mt-3 text-sm text-gray-500">
            Manage and view your account information.
          </p>
        </div>

        {/* Profile Card */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          {/* Profile Header */}
          <div className="bg-gray-50/70 px-6 py-8 sm:px-8">
            <div className="flex flex-col items-center gap-5 sm:flex-row">
              {/* Avatar */}
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-black text-2xl font-medium text-white">
                {firstLetter}
              </div>

              {/* User Info */}
              <div className="text-center sm:text-left">
                <h2 className="text-xl font-semibold text-gray-900">
                  {user.name || "User"}
                </h2>

                <div className="mt-2 flex items-center justify-center gap-2 text-sm text-gray-500 sm:justify-start">
                  <Mail size={15} />

                  <span className="break-all">
                    {user.email || "No email"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="px-6 py-8 sm:px-8">
            <div className="mb-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900">
                Account Information
              </h3>

              <p className="mt-1 text-xs text-gray-400">
                Your information associated with this account.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Name */}
              <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white">
                    <UserRound
                      size={17}
                      className="text-gray-500"
                    />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Full Name
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {user.name || "Not available"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white">
                    <Mail
                      size={17}
                      className="text-gray-500"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-gray-400">
                      Email Address
                    </p>

                    <p className="mt-1 truncate text-sm font-medium text-gray-900">
                      {user.email || "Not available"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 border-t border-gray-100 pt-8">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900">
                Quick Actions
              </h3>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Link
                  to="/orders"
                  className="group flex items-center justify-between rounded-xl border border-gray-200 px-5 py-4 transition hover:border-gray-400 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <Package
                      size={18}
                      className="text-gray-500"
                    />

                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        My Orders
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        View your recent orders
                      </p>
                    </div>
                  </div>

                  <ArrowRight
                    size={17}
                    className="text-gray-400 transition-transform group-hover:translate-x-1"
                  />
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="group flex items-center justify-between rounded-xl border border-gray-200 px-5 py-4 text-left transition hover:border-red-200 hover:bg-red-50"
                >
                  <div className="flex items-center gap-3">
                    <LogOut
                      size={18}
                      className="text-gray-500 group-hover:text-red-500"
                    />

                    <div>
                      <p className="text-sm font-medium text-gray-800 group-hover:text-red-600">
                        Logout
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        Sign out of your account
                      </p>
                    </div>
                  </div>

                  <ArrowRight
                    size={17}
                    className="text-gray-400 transition-transform group-hover:translate-x-1"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;