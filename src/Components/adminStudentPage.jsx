import React, { useEffect, useState } from 'react';
import api from '../assets/api';
import { useNavigate, useLocation } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

const ManageStudentsPage = () => {
  const location = useLocation();
  const { organizationId, classId } = location.state || {};
  const [classStudents, setClassStudents] = useState([]);
  const [orgStudents, setOrgStudents] = useState([]);
  const [searchClass, setSearchClass] = useState('');
  const [searchOrg, setSearchOrg] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const [deleteStudentId, setDeleteStudentId] = useState(null);
  const [addedStudents, setAddedStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      toast.error("Session expired");
      navigate('/', { replace: true });
    }
  }, [navigate]);

  // Fetch the class and organization students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const classResponse = await api.post('/student/class-students', {
          classId,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
          },
        });
        const orgResponse = await api.post('/student/organization/get-all', {
          organizationId,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
          },
        });

        setClassStudents(classResponse.data.students || []);
        setOrgStudents(orgResponse.data.students || []);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to fetch students. Please try again later.');
        setLoading(false);
      }
    };

    if (classId && organizationId) {
      fetchStudents();
    }
  }, [classId, organizationId]);

  const handleAddStudentToClass = async (studentId) => {
    try {
      const response = await api.put('/student/add-student-to-class', {
        classId,
        studentId,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
        },
      });

      // Update state directly without reloading
      setClassStudents((prevStudents) => [...prevStudents, response.data.student]);
      setOrgStudents((prevOrgStudents) =>
        prevOrgStudents.filter(student => student._id !== studentId) // Remove from orgStudents
      );
      setAddedStudents((prevAdded) => [...prevAdded, studentId]); // Track the added student
      toast.success('Student added to class.');

    } catch (error) {
      toast.error('Failed to add student to class. Please try again later.');
    }
  };

  const handleRemoveStudentFromClass = async (studentId) => {
    if (deleteConfirmationText !== 'DELETE') {
      setError('Please type "DELETE" to confirm.');
      return;
    }
  
    try {
      await api.put('/student/remove-student-from-class', {
        classId,
        studentId,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
        },
      });
  
      setClassStudents((prevStudents) => prevStudents.filter(student => student._id !== studentId));
      
      const removedStudent = classStudents.find(student => student._id === studentId);
      if (removedStudent) {
        setOrgStudents((prevOrgStudents) => {
          if (!prevOrgStudents.some(orgStudent => orgStudent._id === removedStudent._id)) {
            return [...prevOrgStudents, removedStudent];
          }
          return prevOrgStudents;
        });
      }
      
      setDeleteStudentId(null);
      setDeleteConfirmationText('');
      toast.success('Student removed from class.');
    } catch (error) {
      toast.error('Failed to remove student from class. Please try again later.');
    }
  };

  const filteredClassStudents = classStudents.filter(student =>
    student.name.toLowerCase().includes(searchClass.toLowerCase()) ||
    student.regNo.toLowerCase().includes(searchClass.toLowerCase())
  );

  const filteredOrgStudents = orgStudents.filter(student =>
    !classStudents.some(classStudent => classStudent._id === student._id) &&
    (student.name.toLowerCase().includes(searchOrg.toLowerCase()) ||
     student.regNo.toLowerCase().includes(searchOrg.toLowerCase())
    )
  );
  

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top Bar */}
      <div className="bg-blue-600 flex items-center h-16 w-full">
        <h1 className="text-3xl text-white flex justify-start ml-5">Manage Students</h1>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-row w-full min-h-[calc(100vh-4rem)]">
        
        {/* Sidebar */}
        <div className="flex-1 m-4 shadow-md overflow-y-scroll scrollbar-hide max-h-screen p-2">
        <div className='flex flex-row justify-between'>
          <p className="text-xl mb-2">Class Students</p>
          <p className="text-xl mb-2">Count : {filteredClassStudents.length}</p>
          </div>
          <input
            type="text"
            placeholder="Search Class Students"
            className="p-2 mb-4 rounded-md w-full bg-slate-100 shadow-md"
            value={searchClass}
            onChange={(e) => setSearchClass(e.target.value)}
          />
          <ul>
            {filteredClassStudents.map((student) => (
              <div
                key={student._id}
                className="mb-2 w-full bg-white border rounded-md shadow-sm p-2 px-3 flex justify-between items-center"
              >
                <div>
                  <p>RegNo: {student.regNo}</p>
                  <p>Name: {student.name}</p>
                  <p>ID: {student.studentId}</p>
                </div>
                <button
                  onClick={() => {
                    setDeleteStudentId(student._id);
                    setError(null);
                  }}
                  className="text-red-600 hover:bg-red-300 h-full p-3 rounded-full"
                >
                  <DeleteIcon />
                </button>
              </div>
            ))}
          </ul>

          {deleteStudentId && (
            <div className="fixed inset-0 flex z-50 items-center justify-center bg-gray-500 bg-opacity-50">
              <div className="bg-white p-7 rounded-md shadow-lg overflow-hidden">
                <h2 className="text-lg font-bold">Confirm Remove</h2>
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
                    onClick={() => setDeleteStudentId(null)}
                    className="bg-gray-300 p-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleRemoveStudentFromClass(deleteStudentId)}
                    className="bg-red-500 text-white p-2 rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className='h-10 w-10 -ml-4 absolute top-1/2 left-1/2'>
        <SwapHorizIcon className="text-blue-500" style={{ fontSize: '35px' }} />

        </div>

        {/* Organization Students */}
        <div className="flex-1 m-4 shadow-md overflow-y-scroll scrollbar-hide max-h-screen p-2">
          <div className='flex flex-row justify-between'>
          <p className="text-xl mb-2">Organization Students</p>
          <p className="text-xl mb-2">Count : {filteredOrgStudents.length}</p>
          </div>
          <input
            type="text"
            placeholder="Search Organization Students"
            className="p-2 mb-4 rounded-md w-full bg-slate-100 shadow-md"
            value={searchOrg}
            onChange={(e) => setSearchOrg(e.target.value)}
          />
          <ul>
            {filteredOrgStudents.map((student) => (
              <div
                key={student._id}
                className="mb-2 w-full bg-white border rounded-md shadow-sm p-2 px-3 flex justify-between items-center"
              >
                <div>
                  <p>RegNo: {student.regNo}</p>
                  <p>Name: {student.name}</p>
                  <p>ID: {student.studentId}</p>
                </div>
                <button
                  onClick={() => handleAddStudentToClass(student._id)}
                  className="text-green-600 hover:bg-green-300 h-full p-3 rounded-full"
                >
                  <AddIcon />
                </button>
              </div>
            ))}
          </ul>
        </div>
      </div>

      <ToastContainer autoClose={1000} />
    </div>
  );
};

export default ManageStudentsPage;
