import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../assets/api";

const AdminLogin = () => {
  const [adminId, setAdminId] = useState("");
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if admin_token is present in local storage on component mount
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      navigate("/admin-dashboard"); // Redirect to admin dashboard
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/auth/admin/login", {
        adminId,
        secret,
      });

      if (response.status === 200) {
        const token = response.data.token;
        localStorage.setItem("admin_token", token);
        navigate("/admin-dashboard");
      } else {
        alert("Login error: " + response.data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen w-full bg-white">
      {/* Header */}
      <div className="bg-blue-500 flex items-center h-16 mb-5 w-full">
        <h1 className="text-3xl text-white flex justify-start ml-5">Quizy</h1>
      </div>

      {/* Login Section */}
      <div className="flex flex-col items-center justify-center w-full">
        <h1 className="text-3xl font-bold text-blue-600 mb-8">Admin Login</h1>

        {/* Admin Login Form */}
        <div className="bg-blue-50 shadow-lg rounded-lg p-8 w-full max-w-md">
          <form onSubmit={handleSubmit}>
            {/* Admin ID Field */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-blue-600 mb-2">
                Admin ID
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Enter your admin ID"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                required
              />
            </div>

            {/* Key ID Field */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-blue-600 mb-2">
                Key ID
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Enter your key ID"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
