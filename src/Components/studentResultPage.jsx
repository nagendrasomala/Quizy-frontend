import React, { useState, useEffect, useRef } from 'react';
import api from '../assets/api'; // Adjust import path as needed
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';

const StudentQuizResultPage = ({ quizId }) => {
  const [questions, setQuestions] = useState([]);
  const [selectedSection, setSelectedSection] = useState('overview');
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnalysisSection, setSelectedAnalysisSection] = useState('bestPerformingTopics'); 
  const hasFetchedAnalysis = useRef(false); 
  const attemptedQuestions = questions.filter(
    (question) => question.optedAnswer !== undefined
  ).length;
  const correctlyAttempted = questions.filter(
    (question) =>
      question.optedAnswer !== undefined &&
      question.optedAnswer === question.correctAnswer
  ).length;
  const wronglyAttempted = attemptedQuestions - correctlyAttempted;

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await api.post(
          '/quiz/quiz-attemptedInfo',
          { quizId },
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('student_token')}`,
              'Content-Type': 'application/json',
            },
          }
        );

        setQuestions(response.data.questions);
        console.log(response.data.questions)
        setLoading(false);
      } catch (error) {
        console.error('Error fetching quiz data:', error);
        toast.error('Failed to load quiz data.');
        setLoading(false);
      }
    };

    if (quizId) {
      fetchQuizData();
    } else {
      toast.error('Quiz ID is missing.');
      setLoading(false);
    }
  }, [quizId]);

  useEffect(() => {
    const fetchAnalysisData = async () => {
      if (hasFetchedAnalysis.current) return; // Prevent fetching if already fetched

      try {
        const response = await axios.post(
          'https://gemini-backend-6193.onrender.com/analyze-questions',
          { questions },
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('student_token')}`,
              'Content-Type': 'application/json',
            },
          }
        );

        setAnalysisData(response.data.analysis);
        hasFetchedAnalysis.current = true; 
        setLoading(false);
      } catch (error) {
        console.error('Error fetching analysis data:', error);
        toast.error('Failed to load analysis data.');
        setLoading(false);
      }
    };

    if (questions.length > 0) {
      fetchAnalysisData();
    } else {
      setLoading(false);
    }
  }, [questions]);

  const handleSectionChange = (section) => {
    setSelectedSection(section);
  };

  const selectAnalysisSection = (section) => {
    setSelectedAnalysisSection(section); 
  };

  const getHoverStyle = (section) => {
    const baseStyle = 'p-1 px-3 rounded-xl cursor-pointer transition-colors duration-300';
    
    switch (section) {
      case 'bestPerformingTopics':
        return selectedAnalysisSection === section
          ? `${baseStyle} bg-green-200 shadow-green-300`
          : `${baseStyle} hover:bg-green-300`;
      case 'improvementNeededTopics':
        return selectedAnalysisSection === section
          ? `${baseStyle} bg-red-200 shadow-red-300`
          : `${baseStyle} hover:bg-red-300`;
      case 'strengths':
        return selectedAnalysisSection === section
          ? `${baseStyle} bg-blue-200 shadow-blue-300`
          : `${baseStyle} hover:bg-blue-300`;
      case 'areasOfAppreciation':
        return selectedAnalysisSection === section
          ? `${baseStyle} bg-purple-200 shadow-purple-300`
          : `${baseStyle} hover:bg-purple-300`;
      case 'furtherRecommendations':
        return selectedAnalysisSection === section
          ? `${baseStyle} bg-orange-200 shadow-orange-300`
          : `${baseStyle} hover:bg-orange-300`;
      default:
        return `${baseStyle} bg-gray-200 hover:bg-gray-300`;
    }
  };
  
  if (loading) {
    return (
      <div className="flex h-screen w-full justify-center items-center">
        <CircularProgress className="text-8xl" />
      </div>
    );
  }
  

  return (
    <div className="p-4 ">
      <div className="flex justify-around shadow-sm mb-4 w-2/12 rounded-md">
        <button
          className={`p-2 px-4 rounded-md ${selectedSection === 'overview' ? 'bg-blue-500 text-white' : 'bg-white'}`}
          onClick={() => handleSectionChange('overview')}
        >
          Overview
        </button>
        <button
          className={`p-2 px-5 rounded-md ${selectedSection === 'analysis' ? 'bg-blue-500 text-white' : 'bg-white'}`}
          onClick={() => handleSectionChange('analysis')}
        >
          Analysis
        </button>
      </div>

      {selectedSection === 'overview' && (
          <div className="mt-4 lg:p-4 rounded-md max-h-[calc(100vh-11rem)] overflow-y-scroll scrollbar-hide">
            <div className="flex flex-col p-4 w-full lg:w-9/12 mb-5 shadow-sm border rounded-md">
              <h1 className="text-2xl font-bold text-blue-600 mb-4">Quiz Summary</h1>
              <div className="flex flex-col gap-2 lg:flex-row justify-between px-2 text-md text-black">
                <p className="border rounded-xl shadow-sm p-1 px-3 font-serif">Total Questions: {questions.length}</p>
                <p className="border rounded-xl shadow-sm p-1 px-3 font-serif">Attempted Questions: {attemptedQuestions}</p>
                <p className="border rounded-xl shadow-sm p-1 px-3 font-serif">Correctly Attempted: {correctlyAttempted}</p>
                <p className="border rounded-xl shadow-sm p-1 px-3 font-serif">Wrongly Attempted: {wronglyAttempted}</p>
              </div>
            </div>
            {questions.map((question, index) => {
              const optionsArray = Object.values(question.options); 
              const isAttempted = question.optedAnswer !== undefined;
              const isCorrect = isAttempted && question.optedAnswer === question.correctAnswer;

              return (
                <div key={index} className="p-4 w-full lg:w-9/12 mb-5 shadow-sm border rounded-md">
                  <p className="font-semibold">{`Q${index + 1}: ${question.questionText}`}</p>
                  <div className="mt-2">
                    {optionsArray.map((option, i) => {
                      const isOptionCorrect = option === question.correctAnswer;
                      const isOptionSelected = option === question.optedAnswer;
                      return (
                        <div
                          key={i}
                          className={`p-2 mb-3 rounded-md ${
                            isOptionCorrect
                              ? 'bg-green-200 text-green-700'
                              : isOptionSelected && !isOptionCorrect
                              ? 'bg-red-200 text-red-700'
                              : 'bg-gray-100'
                          }`}
                        >
                          {option}
                          {isOptionCorrect && <CheckCircleIcon className="ml-2" />}
                          {isOptionSelected && !isOptionCorrect && <CancelIcon className="ml-2" />}
                        </div>
                      );
                    })}
                  </div>
                  <p
                    className={`mt-3 px-1 font-semibold ${
                      isCorrect
                        ? 'text-green-600'
                        : !isAttempted
                        ? 'text-gray-500'
                        : 'text-red-600'
                    }`}
                  >
                    {isCorrect
                      ? 'Correctly Answered'
                      : !isAttempted
                      ? 'Not Answered'
                      : 'Wrongly Answered'}
                  </p>
                </div>
              );
            })}
          </div>
        )}


      {selectedSection === 'analysis' && analysisData && (
        <div className="mt-4 p-4 w-full lg:w-11/12 border rounded-md">
          <h2 className="font-bold text-lg">Overall Accuracy: {analysisData.overallAccuracy}</h2>

          <div className='flex flex-col gap-2 lg:flex-row justify-between mt-4 mb-4'>
            {['bestPerformingTopics', 'improvementNeededTopics', 'strengths', 'areasOfAppreciation', 'furtherRecommendations'].map((section) => (
              <div key={section}>
                <h3 
                  className={` border shadow-md  ${getHoverStyle(section)}`}
                  onClick={() => selectAnalysisSection(section)} // Directly set the selected section
                >
                  {section.charAt(0).toUpperCase() + section.slice(1).replace(/([A-Z])/g, ' $1')}
                </h3>
              </div>
            ))}
          </div>

          <div className="mt-8 min-h-96">
            {/* Analysis Section Headings */}
            <div className="flex flex-col">
              {selectedAnalysisSection === 'bestPerformingTopics' && analysisData.bestPerformingTopics.map((topic, index) => (
                <div key={index} className="p-2 mb-3 rounded-md bg-green-50">
                  <p className="font-semibold">{topic.topic}</p>
                  <p>{topic.details}</p>
                </div>
              ))}

              {/* Additional sections follow the same structure */}
              {selectedAnalysisSection === 'improvementNeededTopics' && (
                <>
                  {analysisData.improvementNeededTopics.length > 0 ? (
                    analysisData.improvementNeededTopics.map((topic, index) => (
                      <div key={index} className="p-2 mb-3 rounded-md bg-red-50">
                        <p className="font-semibold">{topic.topic}</p>
                        <p>{topic.details}</p>
                      </div>
                    ))
                  ) : (
                    <p>No areas for improvement identified.</p>
                  )}
                </>
              )}
              {selectedAnalysisSection === 'strengths' && analysisData.strengths.map((strength, index) => (
                <div key={index} className="p-2 mb-3 rounded-md bg-blue-50">
                  <p className="font-semibold">{strength.point}</p>
                  <p>{strength.details}</p>
                </div>
              ))}
              {selectedAnalysisSection === 'areasOfAppreciation' && analysisData.areasOfAppreciation.map((appreciation, index) => (
                <div key={index} className="p-2 mb-3 rounded-md bg-purple-50">
                  <p className="font-semibold">{appreciation.point}</p>
                  <p>{appreciation.details}</p>
                </div>
              ))}
              {selectedAnalysisSection === 'furtherRecommendations' && analysisData.furtherRecommendations.map((recommendation, index) => (
                <div key={index} className="p-2 mb-3 rounded-md bg-orange-50">
                  <p className="font-semibold">{recommendation.point}</p>
                  <p>{recommendation.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentQuizResultPage;
