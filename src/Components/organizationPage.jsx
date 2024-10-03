import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import api from '../assets/api'; // Import your API module
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Input } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify'; // Import Toastify components
import 'react-toastify/dist/ReactToastify.css';
import { FaUserGraduate } from "react-icons/fa";
import { FaGraduationCap } from "react-icons/fa";
import CircularProgress from '@mui/material/CircularProgress';

const OrganizationPage = () => {
  const [search, setSearch] = useState('');
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteOrgId, setDeleteOrgId] = useState(null);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const [addStudentOrgId, setAddStudentOrgId] = useState(null); // For student form
  const [addFacultyOrgId, setAddFacultyOrgId] = useState(null); // For faculty form
  const [studentData, setStudentData] = useState({ regNo: '', name: '', email: '', password: '' });
  const [facultyData, setFacultyData] = useState({ regId: '', name: '', email: '', password: '' }); // Faculty form data
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await api.get('/admin/organizations', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
          },
        });

        if (response.data && response.data.organizations) {
          setOrganizations(response.data.organizations);
        } else {
          toast.error('No organizations found.');
        }
      } catch (error) {
        toast.error('Error fetching organizations.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  const filteredOrganizations = organizations.filter(org =>
    org.name.toLowerCase().includes(search.toLowerCase()) ||
    org.organizationId.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteOrganization = async (orgId) => {
    if (deleteConfirmationText !== 'DELETE') {
      toast.error('Please type "DELETE" to confirm.');
      return;
    }

    try {
      await api.delete(`/admin/delete/organization`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
          'Content-Type': 'application/json', 
        },
        data: { organizationId: orgId }, 
      });
      toast.success("Deleted successfully..!");
      setOrganizations((prevOrgs) => prevOrgs.filter(org => org._id !== orgId));
      setDeleteOrgId(null);
      setDeleteConfirmationText('');
      setError(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete organization. Please try again later.');
    }
  };

  const handleAddStudent = async () => {
    try {
      await api.post('/student/register-student', {
        organizationId: addStudentOrgId,
        ...studentData,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
          'Content-Type': 'application/json',
        },
      });
      toast.success('Student added successfully!');
      setAddStudentOrgId(null);
      setStudentData({ regNo: '', name: '', email: '', password: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add student.');
    }
  };

  const handleAddFaculty = async () => {
    try {
      await api.post('/faculty/register-faculty', {
        organizationId: addFacultyOrgId,
        ...facultyData,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
          'Content-Type': 'application/json',
        },
      });
      toast.success('Faculty added successfully!');
      setAddFacultyOrgId(null);
      setFacultyData({ regId: '', name: '', email: '', password: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add faculty.');
    }
  };

  if (loading) {
    return (
      <div className='flex h-screen w-full justify-center items-center'>
        <CircularProgress className='text-8xl' /> {/* Show loader while data is loading */}
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleNavigate = (name, id) => {
    navigate('/classes', { state: { name, id } });
  };

  return (
    <div className="p-1">
      <div className='flex flex-row justify-between'>
        <h2 className="text-2xl font-bold mb-4">Organizations</h2>

        <input
          type="text"
          placeholder="Search by Name or ID"
          className="p-2 mb-4 rounded-md w-4/12 bg-slate-100 shadow-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <ul>
        {filteredOrganizations.map((org) => (
          <div className='mb-3 flex flex-row w-8/12 h-12 bg-slate-100 rounded-md shadow-sm hover:bg-blue-300 cursor-pointer flex justify-between items-center' key={org._id}>
            <div
              className="w-full px-2"
              onClick={() => handleNavigate(org.name, org._id)}
            >
              <div>{org.name} ({org.organizationId})</div>
            </div>
            <div className="flex items-center ">
              <Button
                onClick={() => {
                  setAddStudentOrgId(org._id);
                  setError(null);
                }}
                className=" h-full w-8 hover:bg-blue-200"
              >
                <FaGraduationCap className='text-3xl' />
              </Button>
              <Button
                onClick={() => {
                  setAddFacultyOrgId(org._id);
                  setError(null);
                }}
                className=" h-full w-7 hover:bg-blue-200"
              >
                <FaUserGraduate className='text-2xl'/>
              </Button>
            
              <Button
                onClick={() => {
                  setDeleteOrgId(org._id);
                  setError(null); 
                }}
                className=" h-full w-8 hover:bg-red-300"
              >
                <DeleteIcon />
              </Button>
            </div>
          </div>
        ))}
      </ul>

      {/* Delete Confirmation */}
      {deleteOrgId && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-lg font-bold">Confirm Delete</h2>
            <p>Please type "DELETE" to confirm:</p>
            <input
              type="text"
              value={deleteConfirmationText}
              onChange={(e) => setDeleteConfirmationText(e.target.value)}
              className="border rounded p-2 w-full"
            />
            {error && <div className="text-red-500">{error}</div>}
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setDeleteOrgId(null)} 
                className="bg-gray-300 p-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteOrganization(deleteOrgId)}
                className="bg-red-500 text-white p-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Form */}
      {addStudentOrgId && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg w-5/12">
            <h2 className="text-lg font-bold">Add Student to Organization</h2>
            <div>
              <label className="block">Registration Number:</label>
              <input
                type="text"
                value={studentData.regNo}
                onChange={(e) => setStudentData({ ...studentData, regNo: e.target.value })}
                className="border rounded p-2 w-full shadow-sm"
                placeholder='Reg no'
              />
            </div>
            <div>
              <label className="block">Name:</label>
              <input
                type="text"
                value={studentData.name}
                onChange={(e) => setStudentData({ ...studentData, name: e.target.value })}
                className="border rounded p-2 w-full shadow-sm"
                placeholder='Name'
              />
            </div>
            <div>
              <label className="block">Email:</label>
              <input
                type="email"
                value={studentData.email}
                onChange={(e) => setStudentData({ ...studentData, email: e.target.value })}
                className="border rounded p-2 w-full shadow-sm"
                placeholder='Email'
              />
            </div>
            <div>
              <label className="block">Password:</label>
              <input
                type="password"
                value={studentData.password}
                onChange={(e) => setStudentData({ ...studentData, password: e.target.value })}
                className="border rounded p-2 w-full shadow-sm"
                placeholder='Password'
              />
            </div>
            {error && <div className="text-red-500">{error}</div>}
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setAddStudentOrgId(null)} 
                className="bg-gray-300 p-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddStudent}
                className="bg-green-500 text-white p-2 rounded"
              >
                Add Student
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Faculty Form */}
      {addFacultyOrgId && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg w-5/12">
            <h2 className="text-lg font-bold">Add Faculty to Organization</h2>
            <div>
              <label className="block">Faculty ID:</label>
              <input
                type="text"
                value={facultyData.regId}
                onChange={(e) => setFacultyData({ ...facultyData, regId: e.target.value })}
                className="border rounded p-2 w-full shadow-sm"
                placeholder='Faculty ID'
              />
            </div>
            <div>
              <label className="block">Name:</label>
              <input
                type="text"
                value={facultyData.name}
                onChange={(e) => setFacultyData({ ...facultyData, name: e.target.value })}
                className="border rounded p-2 w-full shadow-sm"
                placeholder='Name'
              />
            </div>
            <div>
              <label className="block">Email:</label>
              <input
                type="email"
                value={facultyData.email}
                onChange={(e) => setFacultyData({ ...facultyData, email: e.target.value })}
                className="border rounded p-2 w-full shadow-sm"
                placeholder='Email'
              />
            </div>
            <div>
              <label className="block">Password:</label>
              <input
                type="password"
                value={facultyData.password}
                onChange={(e) => setFacultyData({ ...facultyData, password: e.target.value })}
                className="border rounded p-2 w-full shadow-sm"
                placeholder='Password'
              />
            </div>
            {error && <div className="text-red-500">{error}</div>}
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setAddFacultyOrgId(null)} 
                className="bg-gray-300 p-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddFaculty}
                className="bg-green-500 text-white p-2 rounded"
              >
                Add Faculty
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default OrganizationPage;
