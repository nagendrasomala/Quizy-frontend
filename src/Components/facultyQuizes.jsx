// QuizListPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../assets/api'; // API configuration file
import { useParams } from 'react-router-dom';

const QuizListPage = () => {
  const { classId } = useParams(); // Get the class ID from the route
  const [quizzes, setQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch quizzes from the backend using the faculty token and classId
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const faculty_token = localStorage.getItem('faculty_token');
        const response = await api.get(`/quizzes/${classId}`, {
          headers: { Authorization: `Bearer ${faculty_token}` },
        });
        setQuizzes(response.data);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    };
    fetchQuizzes();
  }, [classId]);

  // Filter quizzes based on search term
  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      quiz.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-600">Quizzes for Class {classId}</h1>
      <input
        type="text"
        placeholder="Search by quiz name or code"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border rounded p-2 my-4"
      />
      
        <div className="flex flex-col  mt-3">
            {filteredClasses.map((quiz) => (
            <div key={quiz.id} className="border rounded-md shadow flex flex-row mb-3 items-center w-8/12">
                <div className='flex flex-row  p-2 w-full w-10/12'> 
                <p className="text-xl font-bold">{quiz.name}</p>
                <p className='ml-5' >Code: {quiz.classId}</p>
                </div>
                <button
                className="bg-blue-500 text-white p-2 w-2/12 h-full rounded"
                onClick={() => handleQuizData(quiz.id)}
                >
                Create Quiz
                </button>
          </div>
            ))}
        </div>
    </div>
  );
};

export default QuizListPage;
