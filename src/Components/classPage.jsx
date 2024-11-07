import React, { useEffect, useState } from 'react';
import api from '../assets/api';
import { useNavigate, useLocation } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CircularProgress from '@mui/material/CircularProgress'; // Import MUI CircularProgress for loader

const ClassesPage = () => {
  const location = useLocation();
  const { name: organizationName, id: organizationId } = location.state || {};
  const [search, setSearch] = useState('');
  const [classes, setClasses] = useState([]);
  const [newClassName, setNewClassName] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [deleteClassId, setDeleteClassId] = useState(null);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const navigate = useNavigate();

  const currentPage = location.state?.currentPage || 'home';
  const selectedOrganization = location.state?.selectedOrganization || null;

  useEffect(() => {
    if (currentPage === 'organizations' && selectedOrganization) {
      navigate('/admin-dashboard', { state: { currentPage: 'classes', selectedOrganization } });
    }
  }, [currentPage, selectedOrganization, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin-login");
  };

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await api.post('/admin/organization/classes', {
          organizationId,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
          },
        });

        setClasses(response.data.classes || []);
        setLoading(false);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch classes. Please try again later.');
        setLoading(false);
      }
    };

    if (organizationId) {
      fetchClasses();
    }
  }, [organizationId]);

  const filteredClasses = classes.filter(org =>
    org.name.toLowerCase().includes(search.toLowerCase()) ||
    org.classId.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateClass = async (e) => {
    e.preventDefault();
    if (!newClassName) {
      setError('Class name is required');
      return;
    }

    try {
      const response = await api.post('/admin/create-class', {
        name: newClassName,
        organizationId,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
        },
      });

      setClasses((prevClasses) => [...prevClasses, response.data.class]);
      setNewClassName('');
      setShowForm(false);
      setError(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create class. Please try again later.');
    }
  };

  const handleDeleteClass = async (classId) => {
    if (deleteConfirmationText !== 'DELETE') {
      setError('Please type "DELETE" to confirm.');
      return;
    }

    try {
      const response = await api.delete(`/admin/delete/class`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
        },
        data: { organizationId: organizationId, classId: classId },
      });
      toast.success("Deleted successfully..!");
      setClasses((prevClasses) => prevClasses.filter(cls => cls._id !== classId));
      setDeleteClassId(null);
      setDeleteConfirmationText('');
      setError(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete class. Please try again later.');
    }
  };

  const handleNavigate = (organizationId, classId) => {
    navigate('/manage-students', { state: { organizationId, classId } });
  };

  if (loading) {
    return (
      <div className='flex h-screen w-full justify-center items-center'>
        <CircularProgress className='text-8xl' /> {/* Show loader while data is loading */}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top Bar */}
      <div className="bg-blue-600 flex items-center h-16 w-full">
        <h1 className="text-3xl text-white flex justify-start ml-5">Quizy</h1>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-row w-full min-h-[calc(100vh-4rem)]">
        {/* Sidebar (Hamburger Menu) */}
        <div className={`bg-blue-400 p-4 text-white ${isOpen ? 'w-64' : 'w-16'} transition-all`}>
          <button className="focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
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
              <button
                className="block py-2 rounded-md hover:bg-blue-700 mt-4 w-full"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
        <div className='flex flex-col m-2 w-full'>
          <div className='flex flex-row justify-between w-full'>
            <h1 className=" text-black text-2xl">Classes for Organization: {organizationName || organizationId}</h1>
            <input
              type="text"
              placeholder="Search by Name or ID"
              className="p-2 mb-4 rounded-md w-4/12 bg-slate-100 shadow-md"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className='flex flex-row'>
              <div className="flex justify-between mb-4">
                <button
                  className="bg-blue-500 text-white p-2 rounded"
                  onClick={() => setShowForm((prev) => !prev)}
                >
                  {showForm ? 'Cancel' : 'Create Class'}
                </button>
              </div>

              {showForm && (
                <form onSubmit={handleCreateClass} className="mb-4">
                  <input
                    type="text"
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    placeholder="Class Name"
                    className="border rounded p-2 mr-2"
                    required
                  />
                  <button type="submit" className="bg-green-500 text-white p-2 rounded">Submit</button>
                </form>
              )}
            </div>
          </div>

          <ul className='overflow-y-scroll scrollbar-hide max-h-[calc(100vh-10rem)]'>
            {filteredClasses.map((cla) => (
              <div
                key={cla._id}
                className="mb-2 w-7/12 h-auto bg-white border rounded-md shadow-sm hover:bg-blue-300 cursor-pointer flex justify-between items-center"
              >
                <div className='h-full w-11/12 p-3' onClick={() => handleNavigate(organizationId, cla._id)}>
                  <p>Class Name: {cla.name}</p>
                  <p>Class ID: {cla.classId}</p>
                </div>
                <button
                  onClick={() => {
                    setDeleteClassId(cla._id);
                    setError(null);
                  }}
                  className="text-blue-600 p-4 mr-3 hover:bg-red-300 rounded-full h-full  flex flex-col items-center"
                >
                  <DeleteIcon />
                </button>
              </div>
            ))}
          </ul>

          {deleteClassId && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
              <div className="bg-white p-6 rounded shadow-lg">
                <h2 className="text-lg font-bold">Confirm Delete</h2>
                <p>Please type "DELETE" to confirm:</p>
                <input
                  type="text"
                  value={deleteConfirmationText}
                  onChange={(e) => setDeleteConfirmationText(e.target.value)}
                  className="border rounded p-2 w-full"
                />
                {error && <div className="text-red-500">{error}</div>}
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => setDeleteClassId(null)}
                    className="bg-gray-300 text-black py-2 px-4 rounded mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteClass(deleteClassId)}
                    className="bg-red-500 text-white py-2 px-4 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ToastContainer position="top-right" />
    </div>
  );
};

export default ClassesPage;
