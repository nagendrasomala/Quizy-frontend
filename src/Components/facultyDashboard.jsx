import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import FacultyClassesPage from './facultyClasses';
import QuizListPage from './facultyQuizes';

const FacultyDashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract current page and selected class from URL state
  const currentPage = location.state?.currentPage || 'home';
  const selectedClass = location.state?.selectedClass || null;

  // Effect to handle initial page state
  useEffect(() => {
    if (currentPage === 'classes' && selectedClass) {
      navigate('/faculty-dashboard', { state: { currentPage: 'quizzes', selectedClass } });
    }
  }, [currentPage, selectedClass, navigate]);

  // Function to render the main content based on menu selection
  const renderContent = () => {
    if (currentPage === 'classes') {
      return <FacultyClassesPage onSelectClass={handleSelectClass} />;
    } else if (currentPage === 'quizzes') {
      return <QuizListPage classId={selectedClass} />;
    } else {
      return (
        <div>
          <h1 className="text-3xl font-bold text-blue-600">Welcome to the Faculty Dashboard</h1>
          <p>Select a menu option to get started.</p>
        </div>
      );
    }
  };

  // Function to handle class selection
  const handleSelectClass = (cls) => {
    navigate('/faculty-dashboard', { state: { currentPage: 'quizzes', selectedClass: cls } });
  };

 // Function to handle logout
const handleLogout = () => {
  localStorage.removeItem('faculty_token'); 
  navigate("/faculty-login"); 
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
            {/* Hamburger icon */}
            ☰
          </button>
          {isOpen && (
            <div className="mt-4">
              <button
                className="block py-2 rounded-md hover:bg-blue-700 w-full"
                onClick={() => navigate('/faculty-dashboard', { state: { currentPage: 'classes' } })}
              >
                My Classes
              </button>
              <button
                className="block py-2 rounded-md hover:bg-blue-700 w-full"
                onClick={() => navigate('/faculty-dashboard', { state: { currentPage: 'quizzes', selectedClass } })}
              >
                My Quizzes
              </button>
              <button
                className="block py-2 rounded-md hover:bg-blue-700 w-full"
                onClick={() => window.open('https://question-paper-gen.vercel.app/', '_self')} 
              >
                Generate Qp
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

export default FacultyDashboard;
