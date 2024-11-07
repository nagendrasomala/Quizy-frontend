import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CreateOrganization from './createOrg';
import AdminsPage from './AdminsList';
// import ViewAdminsPage from './ViewAdminsPage'; 
// import CreateAdmin from './CreateAdmin'; 


const SuperAdminDashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate(); 
  const location = useLocation();

  // Extract current page and selected admin from URL state
  const currentPage = location.state?.currentPage || 'home'; 
  const selectedAdmin = location.state?.selectedAdmin || null;

  // Effect to handle initial page state
  useEffect(() => {
    if (currentPage === 'admins' && selectedAdmin) {
      navigate('/super-admin-dashboard', { state: { currentPage: 'admin-details', selectedAdmin } });
    }
  }, [currentPage, selectedAdmin, navigate]);

  // Function to render the main content based on menu selection
  const renderContent = () => {
    if (currentPage === 'admins') {
      return <AdminsPage/>;
    } 
    else if (currentPage === 'create-org') {
      return <CreateOrganization />;
    } else {
      return (
        <div>
          <h1 className="text-3xl font-bold text-blue-600">Welcome to the SuperAdmin Dashboard</h1>
          <p>Select a menu option to get started.</p>
        </div>
      );
    }
  };

  // Function to handle admin selection
  const handleSelectAdmin = (admin) => {
    navigate('/super-admin-dashboard', { state: { currentPage: 'admin-details', selectedAdmin: admin } });
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('super_admin_token'); 
    navigate("/superadmin-login"); 
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Bar */}
      <div className="bg-blue-600 flex items-center h-16 w-full">
        <h1 className="text-3xl text-white flex justify-start ml-5">Quizy SuperAdmin</h1>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-row w-full min-h-screen">
        {/* Sidebar (Hamburger Menu) */}
        <div className={`bg-blue-400 p-4 text-white ${isOpen ? 'w-64' : 'w-16'} transition-all`}>
          <button className="focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
            {/* Hamburger icon */}
            ☰
          </button>
          {isOpen && (
            <div className="mt-4">
              <button
                className="block py-2 rounded-md hover:bg-blue-700 w-full"
                onClick={() => navigate('/super-admin-dashboard', { state: { currentPage: 'admins' } })}
              >
                View Admins
              </button>
              <button
                className="block py-2 rounded-md hover:bg-blue-700 w-full"
                onClick={() => navigate('/super-admin-dashboard', { state: { currentPage: 'create-org' } })}
              >
                Create Organization
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
        <div className="flex-1 p-2 bg-white">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
