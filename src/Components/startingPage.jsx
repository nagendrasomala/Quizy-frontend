import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const StartPage = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  // Function to handle navigation
  const handleLogin = (role) => {
    navigate(`/${role}-login`); // Navigate to the corresponding login page
  };

  return (
    <div className="flex flex-col items-center min-h-screen w-full bg-white">
      <div className="bg-blue-500 flex items-center h-16 mb-5 w-full">
        <h1 className="text-3xl text-white flex justify-start ml-5">Quizy</h1>
      </div>
      <h1 className="text-3xl font-bold text-blue-600 mb-8">Select Your Role</h1>

      <div className="flex lg:flex-row flex-col h-full w-full justify-around">
        {/* Admin Login */}
        <div className="bg-blue-50 shadow-lg lg:mb-0 mb-5 rounded-lg p-8 text-center">
          <h2 className="text-xl font-bold text-blue-600 mb-4">Admin Login</h2>
          <p className="text-gray-600 mb-4">Access your admin dashboard.</p>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
            onClick={() => handleLogin('admin')} 
          >
            Login as Admin
          </button>
        </div>

        {/* Faculty Login */}
        <div className="bg-blue-50 shadow-lg lg:mb-0 mb-5 rounded-lg p-8 text-center">
          <h2 className="text-xl font-bold text-blue-600 mb-4">Faculty Login</h2>
          <p className="text-gray-600 mb-4">Access your faculty portal.</p>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
            onClick={() => handleLogin('faculty')} // Call handleLogin on click
          >
            Login as Faculty
          </button>
        </div>

        {/* Student Login */}
        <div className="bg-blue-50 shadow-lg lg:mb-0 mb-5 rounded-lg p-8 text-center">
          <h2 className="text-xl font-bold text-blue-600 mb-4">Student Login</h2>
          <p className="text-gray-600 mb-4">Access your student dashboard.</p>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
            onClick={() => handleLogin('student')} // Call handleLogin on click
          >
            Login as Student
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartPage;
