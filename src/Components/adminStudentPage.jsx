import React, { useEffect, useState } from 'react';
import api from '../assets/api';
import { useNavigate, useLocation } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check'; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManageStudentsPage = () => {
  const location = useLocation();
  const {organizationId, classId } = location.state || {};
  const [classStudents, setClassStudents] = useState([]);
  const [orgStudents, setOrgStudents] = useState([]);
  const [searchClass, setSearchClass] = useState('');
  const [searchOrg, setSearchOrg] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const [deleteStudentId, setDeleteStudentId] = useState(null);
  const [addedStudents, setAddedStudents] = useState([]); // New state to track added students
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

      setClassStudents((prevStudents) => [...prevStudents, response.data.student]);
      setAddedStudents((prevAdded) => [...prevAdded, studentId]); // Track the added student
      toast.success('Student added to class.');
        window.location.reload();
      
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
      setDeleteStudentId(null);
      setDeleteConfirmationText('');
      window.location.reload();
      toast.success('Student removed from class.');
    } catch (error) {
      toast.error('Failed to remove student from class. Please try again later.');
    }
  };

  const filteredClassStudents = classStudents.filter(student =>
    student.name.toLowerCase().includes(searchClass.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchClass.toLowerCase())
  );

  const filteredOrgStudents = orgStudents.filter(student =>
    !classStudents.some(classStudent => classStudent._id === student._id) && 
    !addedStudents.includes(student._id) &&
    (student.name.toLowerCase().includes(searchOrg.toLowerCase()) ||
     student.studentId.toLowerCase().includes(searchOrg.toLowerCase()))
  );

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top Bar */}
      <div className="bg-blue-600 flex items-center h-16 w-full">
        <h1 className="text-3xl text-white flex justify-start ml-5">Manage Students</h1>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-row w-full min-h-screen">
        {/* Sidebar */}
        <div className="flex-1 m-4  shadow-md overflow-scroll max-h-screen p-2">
          <h2 className="text-xl mb-2">Class Students</h2>
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
                className="mb-2 w-full bg-slate-100 rounded-md shadow-sm p-2 flex justify-between items-center"
              >
                <div>
                  <p>Name: {student.name}</p>
                  <p>ID: {student.studentId}</p>
                </div>
                <button
                  onClick={() => {
                    setDeleteStudentId(student._id);
                    setError(null);
                  }}
                  className="text-red-600"
                >
                  <DeleteIcon />
                </button>
              </div>
            ))}
          </ul>

          {deleteStudentId && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
              <div className="bg-white p-4 rounded shadow-lg overflow-hidden">
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

        {/* Organization Students */}
        <div className="flex-1 m-4 shadow-md overflow-scroll max-h-screen p-2">
          <h2 className="text-xl mb-2">Organization Students</h2>
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
                className="mb-2 w-full bg-slate-100 rounded-md shadow-sm p-2 flex justify-between items-center"
              >
                <div>
                  <p>Name: {student.name}</p>
                  <p>ID: {student.studentId}</p>
                </div>
                {addedStudents.includes(student._id) ? (
                  <CheckIcon className="text-green-600" /> // Display tick icon if student is added
                ) : (
                  <button
                    onClick={() => handleAddStudentToClass(student._id)}
                    className="text-green-600 hover:bg-blue-400 h-full w-12"
                  >
                    <AddIcon />
                  </button>
                )}
              </div>
            ))}
          </ul>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default ManageStudentsPage;
