// FacultyClassesPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../assets/api'; // API configuration file
import { useNavigate } from 'react-router-dom';

const FacultyClassesPage = () => {
  const [classes, setClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Fetch classes from the backend using the faculty token
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const faculty_token = localStorage.getItem('faculty_token');
        const response = await api.get('/faculty/get-classes', { headers: { Authorization: `Bearer ${faculty_token}` } });
       
        setClasses(response.data.classes);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };
    fetchClasses();
  }, []);

  // Filter classes based on search term
  const filteredClasses = classes.filter(
    (cls) =>
      cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.classId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Navigate to the Create Quiz Page
  const handleCreateQuiz = (classId) => {
    navigate('/create-quizes', { state: { classId: classId } });
  };

  return (
    <div className=''>
    <div className='flex flex-row justify-between items-center'>
      <p className="text-3xl font-bold text-blue-600">Classes of Organization</p>
      <input
        type="text"
        placeholder="Search by class name or code"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 rounded-md w-4/12 bg-white shadow-sm border"
      />
      </div>
      <div className="flex flex-col  mt-3">
        {filteredClasses.map((cls) => (
          <div key={cls.id} className="border rounded-md shadow flex flex-row mb-3 items-center w-8/12">
            <div className='flex flex-row  p-2 items-center  w-10/12'> 
            <p className="text-xl font-bold">{cls.name}</p>
            <p className='ml-5' >Code: {cls.classId}</p>
            </div>
            <button
              className="bg-blue-500 text-white p-2 w-2/12 h-full rounded"
              onClick={() => handleCreateQuiz(cls._id)}
            >
              Create Quiz
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FacultyClassesPage;
