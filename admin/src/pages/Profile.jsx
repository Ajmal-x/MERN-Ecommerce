import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  ShieldCheck,
  Store,
  Pencil,
  Check,
  X,
  CalendarDays,
  Lock,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App";

const Profile = () => {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("admin");

  const [originalName, setOriginalName] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");

  // INFO: Get admin profile from backend
  const fetchProfile = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Authentication required.");
        return;
      }

      const response = await axios.get(
        `${backendUrl}/api/user/admin/profile`,
        {
          headers: {
            token,
          },
        }
      );

      if (response.data.success) {
        const admin = response.data.user;

        setName(admin.name || "");
        setEmail(admin.email || "");
        setRole(admin.role || "admin");

        setOriginalName(admin.name || "");
        setOriginalEmail(admin.email || "");
      } else {
        toast.error(response.data.message || "Failed to load profile.");
      }
    } catch (error) {
      console.error(
        "Error loading admin profile:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load administrator profile."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // INFO: Save admin profile
  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Name is required.");
      return;
    }

    if (!email.trim()) {
      toast.error("Email is required.");
      return;
    }

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${backendUrl}/api/user/admin/profile`,
        {
          name: name.trim(),
          email: email.trim(),
        },
        {
          headers: {
            token,
          },
        }
      );

      if (response.data.success) {
        const updatedAdmin = response.data.user;

        setName(updatedAdmin.name);
        setEmail(updatedAdmin.email);
        setRole(updatedAdmin.role);

        setOriginalName(updatedAdmin.name);
        setOriginalEmail(updatedAdmin.email);

        setEditing(false);

        toast.success("Profile updated successfully.");
      } else {
        toast.error(
          response.data.message || "Failed to update profile."
        );
      }
    } catch (error) {
      console.error(
        "Error updating admin profile:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // INFO: Cancel editing
  const handleCancel = () => {
    setName(originalName);
    setEmail(originalEmail);
    setEditing(false);
  };

  // INFO: Convert role to readable text
  const roleLabel =
    role === "admin" ? "Store Manager" : role;

  if (loading) {
    return (
      <div className="min-h-full bg-[#f8f8f7] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
            <div className="mt-4 h-8 w-48 animate-pulse rounded bg-gray-200" />
            <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded bg-gray-200" />
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <div className="h-28 animate-pulse bg-gray-200 sm:h-32" />

            <div className="px-5 pb-6 sm:px-6">
              <div className="-mt-10 flex items-end gap-4 sm:-mt-12">
                <div className="h-20 w-20 animate-pulse rounded-2xl bg-gray-300 sm:h-24 sm:w-24" />

                <div className="pb-1">
                  <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
                  <div className="mt-2 h-4 w-24 animate-pulse rounded bg-gray-200" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 h-64 animate-pulse rounded-2xl bg-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#f8f8f7] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
            <User size={14} />
            Account
          </div>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
                My Profile
              </h1>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Manage your administrator account information.
              </p>
            </div>

            {!editing ? (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="flex items-center justify-center gap-2 rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800"
              >
                <Pencil size={15} />
                Edit profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <X size={15} />
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Check size={15} />

                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Profile Card */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_3px_20px_rgba(0,0,0,0.025)]">
            {/* Cover */}
            <div className="h-28 bg-gray-950 sm:h-32" />

            {/* Profile Header */}
            <div className="px-5 pb-6 sm:px-6">
              <div className="-mt-10 flex flex-col gap-4 sm:-mt-12 sm:flex-row sm:items-end">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-gray-100 shadow-sm sm:h-24 sm:w-24">
                  <User
                    size={34}
                    strokeWidth={1.5}
                    className="text-gray-600"
                  />
                </div>

                <div className="pb-1">
                  <h2 className="text-lg font-bold text-gray-950">
                    {name || "Administrator"}
                  </h2>

                  <div className="mt-1 flex items-center gap-2">
                    <span className="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-semibold text-green-600">
                      Active
                    </span>

                    <span className="text-xs text-gray-400">
                      {roleLabel}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Personal Information */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_3px_20px_rgba(0,0,0,0.025)]">
            <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                  <User
                    size={18}
                    className="text-gray-700"
                  />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-950">
                    Personal information
                  </h2>

                  <p className="mt-1 text-xs text-gray-400">
                    Your administrator account details.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
              {/* Name */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-gray-700">
                  Full name
                </label>

                {editing ? (
                  <div className="relative">
                    <User
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:bg-white"
                    />
                  </div>
                ) : (
                  <div className="flex h-11 items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4">
                    <User
                      size={16}
                      className="text-gray-400"
                    />

                    <span className="text-sm text-gray-700">
                      {name || "Not provided"}
                    </span>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-gray-700">
                  Email address
                </label>

                {editing ? (
                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:bg-white"
                    />
                  </div>
                ) : (
                  <div className="flex h-11 items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4">
                    <Mail
                      size={16}
                      className="text-gray-400"
                    />

                    <span className="truncate text-sm text-gray-500">
                      {email || "Not provided"}
                    </span>
                  </div>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-gray-700">
                  Role
                </label>

                <div className="flex h-11 items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4">
                  <ShieldCheck
                    size={16}
                    className="text-gray-400"
                  />

                  <span className="text-sm text-gray-700">
                    {roleLabel}
                  </span>
                </div>
              </div>

              {/* Store */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-gray-700">
                  Store
                </label>

                <div className="flex h-11 items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4">
                  <Store
                    size={16}
                    className="text-gray-400"
                  />

                  <span className="text-sm text-gray-700">
                    Trendify
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Account Information */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_3px_20px_rgba(0,0,0,0.025)]">
            <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50">
                  <ShieldCheck
                    size={18}
                    className="text-violet-600"
                  />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-950">
                    Account information
                  </h2>

                  <p className="mt-1 text-xs text-gray-400">
                    Security and account status.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6">
              <div className="flex items-center gap-4 rounded-xl bg-gray-50 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
                  <CalendarDays
                    size={17}
                    className="text-gray-500"
                  />
                </div>

                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                    Account status
                  </p>

                  <p className="mt-1 text-sm font-semibold text-green-600">
                    Active
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-xl bg-gray-50 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
                  <Lock
                    size={17}
                    className="text-gray-500"
                  />
                </div>

                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                    Authentication
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    Protected
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;