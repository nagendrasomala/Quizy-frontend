import React, { useState, useEffect } from 'react';
import api from '../assets/api'; 
import { useParams } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa'; // Importing a trash icon
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const QuizListPage = () => {
  const { classId } = useParams(); // Get the class ID from the route
  const [quizzes, setQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // State to manage sorting order

  // Fetch quizzes from the backend using the faculty token and classId
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const faculty_token = localStorage.getItem('faculty_token');
        const response = await api.get('/faculty/quizzes-by-faculty', { headers: { Authorization: `Bearer ${faculty_token}` } });
       
        setQuizzes(response.data.quizzes);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    };
    fetchQuizzes();
  }, []);

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // Format as dd-mm-yyyy
  };

  // Function to format time
  const formatTime = (timeString) => {
    const time = new Date(`1970-01-01T${timeString}`); // Create a date object with a fixed date
    return time.toLocaleTimeString('en-GB', { hour12: false }); // Format as hh:mm:ss in 24-hour format
  };

  // Function to delete a quiz
  const handleDeleteQuiz = async (quizId) => {
    const faculty_token = localStorage.getItem('faculty_token');
    try {
      await api.delete(`/quiz/delete-quiz`, {
        headers: { Authorization: `Bearer ${faculty_token}` },
        data: { quizId }
      });
      toast.success("Quiz Deleted Successfully..!");
      setQuizzes(quizzes.filter(quiz => quiz.quizId !== quizId));
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error('Error deleting quiz:', error);
    }
  };

  // Filter quizzes based on search term
  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.quizId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort quizzes by scheduled date
  const sortedQuizzes = filteredQuizzes.sort((a, b) => {
    const dateA = new Date(a.scheduledDate);
    const dateB = new Date(b.scheduledDate);
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA; // Sort based on current order
  });

  // Function to toggle sorting order
  const toggleSortOrder = () => {
    setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <div className=''>
      <div className='flex flex-row justify-between items-center '>
        <h1 className="text-3xl font-bold text-blue-600">All Quizzes {classId}</h1>
        
        <div className="flex flex-row gap-2 w-6/12 justify-center items-center">
        <input
          type="text"
          placeholder="Search by Quiz Name or ID"
          className="p-2 mb-4 rounded-md w-7/12 bg-white shadow-md border"
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
        {sortedQuizzes.map((quiz) => (
          <div key={quiz.quizId} className="border rounded-md shadow flex flex-row mb-3 items-center w-9/12 p-2">
            <div className="flex flex-col w-10/12">
              <div className="flex flex-row p-2 w-10/12 items-center"> 
                <p className="text-xl font-bold">{quiz.title}</p>
                <p className="ml-5">Code: {quiz.quizId}</p>
              </div>
              <div className="flex flex-row p-2 w-10/12 items-center"> 
                <p className="">Scheduled Date: {formatDate(quiz.scheduledDate)}</p>
                <p className="ml-5">From: {formatTime(quiz.startTime)}</p>
                <p className="ml-5">To: {formatTime(quiz.endTime)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-end w-3/12">
              <button
                className="bg-blue-500 text-white p-2 rounded justify-end"
                onClick={() => handleQuizData(quiz.id)}
              >
                Participants
              </button>
              <button
                className="ml-2 text-red-500 hover:bg-red-200 p-4 rounded-3xl"
                onClick={() => handleDeleteQuiz(quiz._id)} // Use quiz.quizId for deletion
              >
                <FaTrash size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default QuizListPage;
