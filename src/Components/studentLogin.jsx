import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../assets/api";

const StudentLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if student_token is present in local storage on component mount
  useEffect(() => {
    const token = localStorage.getItem("student_token");
    if (token) {
      navigate("/student-dashboard"); // Redirect to student dashboard
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/auth/student/login", {
        email,
        password,
      });

      if (response.status === 200) {
        const token = response.data.token;
        localStorage.setItem("student_token", token);
        navigate("/student-dashboard");
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
        <h1 className="text-3xl font-bold text-blue-600 mb-8">Student Login</h1>

        {/* Student Login Form */}
        <div className="bg-blue-50 shadow-lg rounded-lg p-8 w-full max-w-md">
          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-blue-600 mb-2">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-blue-600 mb-2">
                Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

export default StudentLogin;
