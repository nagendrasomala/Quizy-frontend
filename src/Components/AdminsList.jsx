import React, { useEffect, useState, useMemo } from 'react';
import api from '../assets/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CircularProgress from '@mui/material/CircularProgress';
import { Button, Input } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AdminsList = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filteredAdmins, setFilteredAdmins] = useState([]);

  const navigate = useNavigate();

  // Fetch the organizations and admins data
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await api.get('/superadmin/orgsandadmins', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('super_admin_token')}`,
          },
        });
        setOrganizations(response.data.organizations);
        setLoading(false);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch admins. Please try again later.');
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  // Filter admins based on search input
  useEffect(() => {
    const admins = organizations.map((org) => ({
      ...org.admin,
      organizationName: org.name,
      organizationId: org.organizationId,
    }));

    const filtered = admins.filter(
      (admin) =>
        admin.name.toLowerCase().includes(search.toLowerCase()) ||
        admin.email.toLowerCase().includes(search.toLowerCase())||
        admin.organizationName.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredAdmins(filtered);
  }, [search, organizations]);

  const handleNavigate = (organizationId,organizationName) => {
    navigate('/classes', { state: { organizationId,organizationName } });
  };

  if (loading) {
    return (
      <div className='flex h-screen w-full justify-center items-center'>
        <CircularProgress className='text-8xl' />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white p-2">
        <div className='flex flex-row justify-between'>
                <h1 className="text-3xl font-bold text-blue-600">Admins List</h1>

            
                    <div className="flex flex-row gap-2 w-6/12 justify-center items-center">
                    <input
                        type="text"
                        placeholder="Search by Quiz Name or ID"
                        className="p-2 mb-4 border rounded-md w-7/12 bg-white shadow-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    
                    </div>

            </div>

      {/* Admins List */}
      <div className="flex flex-col mt-6">
        {filteredAdmins.length > 0 ? (
          filteredAdmins.map((admin) => (
            <div
              key={admin._id}
              className="w-8/12 p-4 bg-white border rounded-md shadow-sm mb-4 flex justify-between items-center hover:bg-blue-300 cursor-pointer"
            >
              <div>
              <p><strong>Organization:</strong> {admin.organizationName } (ID: {admin.organizationId})</p>
                <p><strong>Admin Name:</strong> {admin.name}</p>
                <p><strong>Email:</strong> {admin.email}</p>
                
                
              </div>
                {/* <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleNavigate(admin.organizationId,admin.organizationName)}
                >
                    View Organization
                </Button> */}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No admins found.</p>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default AdminsList;
