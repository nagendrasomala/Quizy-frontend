import React, { useState, useEffect } from 'react';
import api from '../assets/api';
import { useParams,useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa'; // Importing a trash icon
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const QuizListPage = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedQuizId, setSelectedQuizId] = useState(null); // State for selected quiz ID
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State for delete modal visibility
  const [confirmationText, setConfirmationText] = useState(''); // State for delete confirmation input

  // Fetch quizzes from the backend using the faculty token and classId
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const faculty_token = localStorage.getItem('faculty_token');
        const response = await api.get('/faculty/quizzes-by-faculty', {
          headers: { Authorization: `Bearer ${faculty_token}` },
        });
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
    return date.toLocaleDateString('en-GB');
  };

  // Function to format time
  const formatTime = (timeString) => {
    const time = new Date(`1970-01-01T${timeString}`);
    return time.toLocaleTimeString('en-GB', { hour12: false });
  };

  // Show the delete confirmation modal
  const handleDeleteQuiz = (quizId) => {
    setSelectedQuizId(quizId);
    setShowDeleteModal(true);
  };

  // Confirm delete quiz if the user types 'delete'
  const confirmDeleteQuiz = async () => {
    if (confirmationText !== 'delete') {
      toast.error('Please type "delete" to confirm.');
      return;
    }

    const faculty_token = localStorage.getItem('faculty_token');
    try {
      await api.delete(`/quiz/delete-quiz`, {
        headers: { Authorization: `Bearer ${faculty_token}` },
        data: { quizId: selectedQuizId },
      });
      toast.success('Quiz Deleted Successfully!');
      setQuizzes(quizzes.filter((quiz) => quiz.quizId !== selectedQuizId));
      setShowDeleteModal(false);
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

  const handleParticipantsClick = (quizId) => {
    navigate('/quiz-participants', { state: { quizId } }); 
  };

  const sortedQuizzes = filteredQuizzes.sort((a, b) => {
    const dateA = new Date(a.scheduledDate);
    const dateB = new Date(b.scheduledDate);
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  // Function to toggle sorting order
  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <div className='max-h-[calc(100vh-4rem)]'>
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

      <div className="flex flex-col mt-5 max-h-[calc(100vh-10rem)] overflow-y-scroll scrollbar-hide">
        {sortedQuizzes.map((quiz) => (
          <div key={quiz.quizId} className="border rounded-md shadow flex flex-row mb-3 items-center w-8/12 p-2">
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
                key={quiz._id}
                onClick={() => handleParticipantsClick(quiz._id)}
              >
                Participants
              </button>
              <button
                className="ml-2 text-red-500 hover:bg-red-200 p-4 rounded-3xl"
                onClick={() => handleDeleteQuiz(quiz._id)} // Set the quiz to be deleted
              >
                <FaTrash size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Are you sure you want to delete this quiz?</h2>
            <p className="mb-2">Please type "delete" to confirm:</p>
            <input
              type="text"
              className="border p-2 w-full mb-4"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
            />
            <div className="flex justify-end gap-4">
              <button
                className="bg-red-500 text-white p-2 rounded"
                onClick={confirmDeleteQuiz}
              >
                Confirm
              </button>
              <button
                className="bg-gray-300 p-2 rounded"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default QuizListPage;
