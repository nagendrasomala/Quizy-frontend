import React, { useEffect, useState } from 'react';
import api from '../assets/api';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material'; 
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

const StudentClassesPage = () => {
  const [search, setSearch] = useState('');
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false); // Sidebar open state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await api.get('/student/my-classes', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('student_token')}`,
          },
        });

        setClasses(response.data.classes || []); 
        setLoading(false);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch classes. Please try again later.');
        setLoading(false);
      }
    };

    fetchClasses(); // Fetch classes on component mount
  }, []);

  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(search.toLowerCase()) ||
    cls.classId.toLowerCase().includes(search.toLowerCase())
  );

  const handleNavigate = (classId) => {
    navigate('/student-classes-quiz', { state: { classId } });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top Bar */}
      <div className="bg-blue-600 flex items-center h-16 w-full">
        <h1 className="text-3xl text-white flex justify-start ml-5">Quizy</h1>
      </div>

      <div className="flex flex-row w-full min-h-screen">
        {/* Sidebar (Hamburger Menu) */}
        <div className={`bg-blue-400 p-4 text-white ${isOpen ? 'w-64' : 'w-16'} transition-all`}>
          <button className="focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
            ☰
          </button>
          {isOpen && (
            <div className="mt-4">
              
              
              <button
                className="block py-2 rounded-md hover:bg-blue-700 w-full"
                onClick={() => navigate('/student-logout')}
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col m-2 w-full">
          <div className='flex flex-row justify-between w-full'>
            <h1 className="text-black text-2xl">My Classes</h1>
            <input
              type="text"
              placeholder="Search by Name or ID"
              className="p-2 mb-4 rounded-md w-4/12 bg-slate-100 shadow-md"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <ul>
            {filteredClasses.map((cls) => (
              <div
                key={cls._id}
                onClick={() => handleNavigate(cls._id)}
                className="mb-2 w-6/12 h-auto bg-white border rounded-md shadow-md hover:bg-blue-300 p-2 px-3 cursor-pointer"
              >
                <div>
                  <p>Class Name: {cls.name}</p>
                  <p>Class ID: {cls.classId}</p>
                </div>
              </div>
            ))}
          </ul>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default StudentClassesPage;
