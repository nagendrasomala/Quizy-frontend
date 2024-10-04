import React, { useEffect, useState } from 'react';
import api from '../assets/api'; // Assuming you're using an API helper like axios
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SQuizListPage = ({ organizationId, studentId }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  // Fetch quizzes for the student based on organizationId and studentId
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

  

  // Filter quizzes based on search term
  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.quizId.toLowerCase().includes(searchTerm.toLowerCase())||
      quiz.facultyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort quizzes by scheduled date
  const sortedQuizzes = filteredQuizzes.sort((a, b) => {
    const dateA = new Date(a.scheduledDate);
    const dateB = new Date(b.scheduledDate);
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  // Toggle sorting order
  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  return (
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

      <div className="flex flex-col mt-5 max-h-screen overflow-y-scroll">
        {sortedQuizzes.length === 0 ? (
          <p>No quizzes available.</p>
        ) : (
          sortedQuizzes.map((quiz) => (
            <div
              key={quiz.quizId}
              className="border rounded-md shadow flex flex-col lg:flex-row mb-3 items-center w-full lg:w-9/12 p-2"
            >
              <div className="flex flex-col w-10/12">
                <div className="flex flex-row p-2 w-10/12 items-center">
                  <p className="text-xl font-bold">{quiz.title}</p>
                  <p className="ml-5">Code: {quiz.quizId}</p>
                </div>
                <div className="flex flex-row p-2 w-10/12 items-center">
                  <p>Faculty: {quiz.facultyName}</p>
                  <p className="ml-5">Class: {quiz.className}</p>
                  <p className="ml-5">Marks: {quiz.score}/{quiz.totalMarks}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default SQuizListPage;
