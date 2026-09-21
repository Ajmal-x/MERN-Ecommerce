import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import {
  Settings as SettingsIcon,
  Lock,
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
} from "lucide-react";

const Settings = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      toast.error("New password must be different from the current password.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${backendUrl}/api/user/admin/password`,
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            token,
          },
        }
      );

      if (response.data.success) {
        toast.success("Password changed successfully.");

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(
        "Error changing password:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to change password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const PasswordInput = ({
    label,
    value,
    setValue,
    showPassword,
    setShowPassword,
    placeholder,
  }) => {
    return (
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          {label}
        </label>

        <div className="relative">
          <KeyRound
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type={showPassword ? "text" : "password"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-12 text-sm outline-none transition focus:border-gray-900 focus:bg-white"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700"
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-900 text-white">
            <SettingsIcon size={21} />
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
              Settings
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage your account and security settings.
            </p>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
              <ShieldCheck size={20} className="text-gray-700" />
            </div>

            <div>
              <h2 className="font-semibold text-gray-900">
                Security
              </h2>

              <p className="text-sm text-gray-500">
                Keep your administrator account secure.
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleChangePassword}
          className="space-y-5 p-6"
        >
          <div className="max-w-xl">
            <PasswordInput
              label="Current Password"
              value={currentPassword}
              setValue={setCurrentPassword}
              showPassword={showCurrentPassword}
              setShowPassword={setShowCurrentPassword}
              placeholder="Enter your current password"
            />
          </div>

          <div className="max-w-xl">
            <PasswordInput
              label="New Password"
              value={newPassword}
              setValue={setNewPassword}
              showPassword={showNewPassword}
              setShowPassword={setShowNewPassword}
              placeholder="Enter your new password"
            />

            <p className="mt-2 text-xs text-gray-500">
              Password must contain at least 8 characters.
            </p>
          </div>

          <div className="max-w-xl">
            <PasswordInput
              label="Confirm New Password"
              value={confirmPassword}
              setValue={setConfirmPassword}
              showPassword={showConfirmPassword}
              setShowPassword={setShowConfirmPassword}
              placeholder="Confirm your new password"
            />
          </div>

          <div className="flex items-center gap-3 border-t border-gray-100 pt-5">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Changing Password..." : "Change Password"}
            </button>

            <button
              type="button"
              onClick={() => {
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
              }}
              disabled={loading}
              className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Authentication Info */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
            <Lock size={19} className="text-gray-700" />
          </div>

          <h3 className="font-semibold text-gray-900">
            Protected Account
          </h3>

          <p className="mt-1 text-sm leading-6 text-gray-500">
            Your administrator account is protected with password
            hashing and JWT authentication.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
            <ShieldCheck size={19} className="text-gray-700" />
          </div>

          <h3 className="font-semibold text-gray-900">
            Admin Access
          </h3>

          <p className="mt-1 text-sm leading-6 text-gray-500">
            Only users with the administrator role can access the
            admin dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;