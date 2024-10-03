import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../assets/api'; // Adjust the import path as necessary
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CircularProgress from '@mui/material/CircularProgress';

const StudentClassQuizListPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); 
  const [isOpen, setIsOpen] = useState(false); 
  const [sortOrder, setSortOrder] = useState('asc'); 
  const location = useLocation();
  const navigate = useNavigate();
  const classId = location.state?.classId;

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await api.post(
          '/student/quizzes',
          { classId },
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('student_token')}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.data && response.data.quizzes) {
          setQuizzes(response.data.quizzes);
        } else {
          throw new Error('No quizzes found in the response.');
        }
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        setError(error.message);
        toast.error(error.message || 'Failed to fetch quizzes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [classId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getCurrentTime = () => {
    const now = new Date();
    return {
      currentDate: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`,
      currentTime: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
    };
  };

  const getQuizStatus = (scheduledDate, startTime, endTime) => {
    const { currentDate, currentTime } = getCurrentTime();

    if (!scheduledDate) {
      return { status: 'Unknown', color: 'text-gray-500' };
    }

    const quizDate = scheduledDate.split('T')[0];

    if (quizDate < currentDate) {
      return { status: 'Expired', color: 'text-red-500' };
    } else if (quizDate > currentDate) {
      return { status: 'Upcoming', color: 'text-blue-500' };
    } else {
      const startDateTime = new Date(`${scheduledDate.split('T')[0]}T${startTime}:00`);
      const endDateTime = new Date(`${scheduledDate.split('T')[0]}T${endTime}:00`);
      const now = new Date();

      if (now >= startDateTime && now <= endDateTime) {
        return { status: 'Active', color: 'text-green-500' };
      } else if (now < startDateTime) {
        return { status: 'Upcoming', color: 'text-blue-500' };
      } else {
        return { status: 'Expired', color: 'text-red-500' };
      }
    }
  };
  const handleLogout = () => {
    localStorage.clear();
    navigate("/student-login");
  };

  const handleTakeQuiz = async (quizId, studentId) => {
    try {
      const response = await api.post(
        '/quiz/check-quiz-submission', 
        { quizId },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('student_token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        navigate("/student-take-quiz", {
          state: {
            quizId: quizId,
            studentId: studentId,
          },
        });
      }
    } catch (error) {
      console.log()
      toast.info('Quiz has already been taken.');
    }
  };

  const handleSort = () => {
    const sortedQuizzes = [...quizzes].sort((a, b) => {
      const dateA = new Date(a.scheduledDate);
      const dateB = new Date(b.scheduledDate);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    setQuizzes(sortedQuizzes);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quiz.quizId.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col m-2 w-full ">
          <div className='flex flex-row justify-between w-full'>
            <h1 className="text-blue-500 font-bold text-2xl">My Quizzes</h1>
            <div className="flex flex-row gap-2 w-6/12 justify-center items-center">
              <input
                type="text"
                placeholder="Search by Quiz Name or ID"
                className="p-2 mb-4 rounded-md w-7/12 border bg-slate-100 shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                onClick={handleSort}
                className="p-2 mb-4 bg-blue-500 text-white rounded-md shadow-md"
              >
                Sort by Date {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
          <div className='overflow-y-scroll max-h-screen'>
            {filteredQuizzes.length === 0 ? (
              <p>No quizzes available.</p>
            ) : (
              <ul>
                {filteredQuizzes.map((quiz) => {
                  const { status, color } = getQuizStatus(quiz.scheduledDate, quiz.startTime, quiz.endTime);

                  return (
                    <div key={quiz._id} className="mt-3 mb-2 w-7/12 h-auto flex flex-row bg-white border rounded-md shadow-md px-2 hover:bg-blue-300 cursor-pointer">
                      <div className="flex justify-between items-center w-10/12 p-2">
                        <div>
                          <div className="flex flex-row items-center">
                            <p className="text-xl font-bold">{quiz.title}</p>
                            <p className="ml-8">{quiz.quizId}</p>
                          </div>
                          <div>
                            <p>Date: {formatDate(quiz.scheduledDate)}</p>
                            <p>Time: {quiz.startTime} - {quiz.endTime}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col w-2/12 h-auto p-2 justify-between items-center">
                        <button
                          onClick={() => handleTakeQuiz(quiz._id)}
                          className={`bg-blue-500 text-white px-4 py-2 rounded-md ${status !== 'Active' ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={status !== 'Active'}
                        >
                          Take Quiz
                        </button>
                        <p className={color}>
                          <AccessTimeIcon/> {status}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default StudentClassQuizListPage;
