import React, { useEffect, useState, useMemo, lazy, Suspense } from 'react';
import api from '../assets/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CircularProgress from '@mui/material/CircularProgress';


const StudentQuizResultPage = lazy(() => import('./studentResultPage'));

const SQuizListPage = ({ organizationId, studentId }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const student_token = localStorage.getItem('student_token');
        const response = await api.get(`/quiz/students/quizzes-attempted`, {
          headers: { Authorization: `Bearer ${student_token}` },
        });
        setQuizzes(response.data.quizzes);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        toast.error('Error fetching quizzes');
      }
    };

    fetchQuizzes();
  }, [organizationId, studentId]);

  const filteredQuizzes = useMemo(() => {
    return quizzes.filter(
      (quiz) =>
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.quizId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.facultyName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [quizzes, searchTerm]);
  
  const sortedQuizzes = useMemo(() => {
    return filteredQuizzes.sort((a, b) => {
      const dateA = new Date(a.scheduledDate);
      const dateB = new Date(b.scheduledDate);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }, [filteredQuizzes, sortOrder]);
  

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  const handleReportClick = (quiz) => {
    setSelectedQuiz(quiz);
  };

  const handleBackToList = () => {
    setSelectedQuiz(null);
  };

  return (
    <div>
      {selectedQuiz ? (
        <Suspense fallback={<div className='flex h-screen w-full justify-center items-center'>
                              <CircularProgress className='text-8xl' /> 
                            </div>}>
          <StudentQuizResultPage quizId={selectedQuiz.quiz_Id} onBack={handleBackToList} />
        </Suspense>
      ) : (
        <div>
          <div className="flex flex-row justify-between items-center">
            <h1 className="text-3xl font-bold text-blue-600">My Quizzes</h1>
            <div className="flex flex-row gap-2 w-6/12 justify-center items-center">
              <input
                type="text"
                placeholder="Search by Quiz Name or ID"
                className="p-2 mb-4 border rounded-md w-7/12 bg-white shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                onClick={toggleSortOrder}
                className="p-2 mb-4 bg-blue-500 text-white rounded-md shadow-md"
              >
                Sort by Date {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>

          <div className="flex flex-col mt-5 max-h-screen overflow-y-scroll scrollbar-hide">
            {sortedQuizzes.length === 0 ? (
              <p>No quizzes available.</p>
            ) : (
              sortedQuizzes.map((quiz) => (
                <div
                  key={quiz.quizId}
                  className="border rounded-md shadow-sm bg-white flex flex-col lg:flex-row mb-3 items-center w-full lg:w-7/12 p-2"
                >
                  <div className="flex flex-col w-10/12">
                    <div className="flex flex-col lg:flex-row p-2 w-10/12 items-center">
                      <p className="text-xl font-bold">{quiz.title}</p>
                      <p className="ml-5">Code: {quiz.quizId}</p>
                    </div>
                    <div className="flex flex-col lg:flex-row p-2 w-10/12 items-center">
                      <p>Faculty: {quiz.facultyName}</p>
                      <p className="ml-5">Class: {quiz.className}</p>
                      <p className="ml-5">Marks: {quiz.score}/{quiz.totalMarks}</p>
                    </div>
                  </div>
                  <div className="flex flex-col lg:items-end w-1/3 lg:w-2/12">
                    <button
                      onClick={() => handleReportClick(quiz)}
                      className="p-2 bg-blue-500 text-white rounded-md shadow-md mt-2 lg:mt-0"
                    >
                      Quiz Report
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default SQuizListPage;
