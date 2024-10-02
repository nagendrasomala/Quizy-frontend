import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import OrganizationPage from './organizationPage';
import ClassesPage from './classPage';
import CreateOrganization from './createOrg';

const AdminDashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate(); 
  const location = useLocation(); // Access the current location

  // Extract current page and selected organization from URL state
  const currentPage = location.state?.currentPage || 'home'; 
  const selectedOrganization = location.state?.selectedOrganization || null;

  // Effect to handle initial page state
  useEffect(() => {
    if (currentPage === 'organizations' && selectedOrganization) {
      navigate('/admin-dashboard', { state: { currentPage: 'classes', selectedOrganization } });
    }
  }, [currentPage, selectedOrganization, navigate]);

  // Function to render the main content based on menu selection
  const renderContent = () => {
    if (currentPage === 'organizations') {
      return <OrganizationPage onSelectOrganization={handleSelectOrganization} />;
    } 
    else if (currentPage === 'create-organization') {
      return <CreateOrganization />;
    } else {
      return (
        <div>
          <h1 className="text-3xl font-bold text-blue-600">Welcome to the Admin Dashboard</h1>
          <p>Select a menu option to get started.</p>
        </div>
      );
    }
  };

  // Function to handle organization selection
  const handleSelectOrganization = (org) => {
    navigate('/admin-dashboard', { state: { currentPage: 'classes', selectedOrganization: org } });
  };

  // Function to handle logout
const handleLogout = () => {
  localStorage.removeItem('admin_token'); 
  navigate("/admin-login"); 
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
        <div className={`bg-blue-400  p-4 text-white ${isOpen ? 'w-64' : 'w-16'} transition-all`}>
          <button className="focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
            {/* Hamburger icon */}
            ☰
          </button>
          {isOpen && (
            <div className="mt-4">
              <button
                className="block py-2 rounded-md hover:bg-blue-700 w-full"
                onClick={() => navigate('/admin-dashboard', { state: { currentPage: 'organizations' } })}
              >
                Organizations
              </button>
              <button
                className="block py-2 rounded-md hover:bg-blue-700 w-full"
                onClick={() => navigate('/admin-dashboard', { state: { currentPage: 'create-organization' } })}
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
        <div className="flex-1 p-8 bg-white">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
