import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SQuizListPage from './studentQuiz';
import SOrganizationsPage from './studentOrganizations';

const StudentDashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract current page and selected organization from URL state
  const currentPage = location.state?.currentPage || 'organizations';
  const selectedOrganization = location.state?.selectedOrganization || null;
  const studentId = localStorage.getItem('student_token'); // Get student token from localStorage

  useEffect(() => {
    if (!studentId) {
      navigate("/student-login"); // Redirect to login if no student token is found
    }
  }, [studentId, navigate]);

  // Function to render the main content based on the menu selection
  const renderContent = () => {
    if (currentPage === 'quizzes') {
      return <SQuizListPage organizationId={selectedOrganization} studentId={studentId} />;
    } else {
      return <SOrganizationsPage studentId={studentId} onSelectOrganization={handleSelectOrganization} />;
    }
  };

  // Function to handle organization selection and navigate to quizzes
  const handleSelectOrganization = (organizationId) => {
    navigate('/student-dashboard', { state: { currentPage: 'quizzes', selectedOrganization: organizationId } });
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('student_token'); // Remove the student token from local storage
    navigate("/student-login"); // Redirect to the login page
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Bar */}
      <div className="bg-blue-600 flex items-center h-16 w-full">
        <h1 className="text-3xl text-white flex justify-start ml-5">Quizy</h1>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-row w-full min-h-screen">
        {/* Sidebar (Hamburger Menu) */}
        <div className={`bg-blue-400 p-4 text-white ${isOpen ? 'w-64' : 'w-16'} transition-all`}>
          <button className="focus:outline-none text-xl" onClick={() => setIsOpen(!isOpen)}>
            ☰
          </button>
          {isOpen && (
            <div className="mt-4">
              <button
                className="block py-2 rounded-md hover:bg-blue-700 w-full"
                onClick={() => navigate('/student-dashboard', { state: { currentPage: 'quizzes', selectedOrganization } })}
              >
                My Quizzes
              </button>
              {/* Logout Button */}
              <button
                className="block py-2 rounded-md hover:bg-blue-700 mt-4 w-full"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Right Side Content */}
        <div className="flex-1 p-3 bg-white">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
