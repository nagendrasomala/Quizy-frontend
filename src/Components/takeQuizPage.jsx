import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import 'react-toastify/dist/ReactToastify.css';
import './takeQuizPage.css';
import api from '../assets/api';
import { Toaster, toast } from 'react-hot-toast';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CircularProgress from '@mui/material/CircularProgress';

const QuizPage = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [quizData, setQuizData] = useState({});
  const [studentData, setStudentData] = useState({});
  const [facultyData, setFacultyData] = useState({});
  const [showTimeUpPopup, setShowTimeUpPopup] = useState(false); 
  const [popupReason, setPopupReason] = useState(''); 
  const [questionsLength,setquestionsLength] = useState(0);
  const [timeWarning,settimeWarning] = useState(1);

  const timerRef = useRef(null);
  const navigate = useNavigate();
  
  const location = useLocation();
  const quizId = location.state?.quizId;
  const studentToken = localStorage.getItem("student_token");
  const userName = studentData.name;
  const regNo = studentData.regNo;


  useEffect(() => {
    const disableRightClick = (e) => {
      e.preventDefault();
    };

    const disableKeyActions = (e) => {
      // Block Ctrl+C, Ctrl+V, F12, and Developer Tools shortcuts
      if (
        (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'u')) || // Ctrl+C, Ctrl+V, Ctrl+U
        e.key === 'F12' || // F12 for Dev Tools
        (e.ctrlKey && e.shiftKey && e.key === 'I') || // Ctrl+Shift+I for Dev Tools
        (e.ctrlKey && e.shiftKey && e.key === 'J') || // Ctrl+Shift+J for Console
        (e.ctrlKey && e.shiftKey && e.key === 'C')    // Ctrl+Shift+C for Inspect
      ) {
        e.preventDefault();
        e.stopPropagation();
        alert('This action is disabled during the quiz.');
      }
    };

    document.addEventListener('contextmenu', disableRightClick);
    document.addEventListener('keydown', disableKeyActions);

    return () => {
      document.removeEventListener('contextmenu', disableRightClick);
      document.removeEventListener('keydown', disableKeyActions);
    };
    }, []);


  const fetchQuizData = async () => {
    try {
      const response = await api.post('/quiz/quiz-details', 
        { quizId }, 
        {
          headers: {
            Authorization: `Bearer ${studentToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status !== 200) {
        throw new Error('Failed to fetch quiz data');
      }

      const data = response.data;
      setQuizData(data.quiz);
      setquestionsLength(data.quiz.questions.length);
      setStudentData(data.student);
      setFacultyData(data.quiz.faculty);

      // Combine scheduledDate with startTime and endTime to create full date objects
      const scheduledDate = new Date(data.quiz.scheduledDate);
      const startTime = data.quiz.startTime.split(':');
      const endTime = data.quiz.endTime.split(':');

      // Create date objects for start and end times
      const quizStartTime = new Date(scheduledDate.getFullYear(), scheduledDate.getMonth(), scheduledDate.getDate(), parseInt(startTime[0]), parseInt(startTime[1]));
      const quizEndTime = new Date(scheduledDate.getFullYear(), scheduledDate.getMonth(), scheduledDate.getDate(), parseInt(endTime[0]), parseInt(endTime[1]));

      // Calculate remaining time based on the current time and end time
      const currentTime = new Date();
      let quizDuration;
      if (currentTime < quizStartTime) {
        quizDuration = quizEndTime.getTime() - quizStartTime.getTime();
      } else if (currentTime >= quizStartTime && currentTime < quizEndTime) {
        quizDuration = quizEndTime.getTime() - currentTime.getTime();
      } else {
        throw new Error('Quiz has already ended');
      }

      setTimeLeft(quizDuration);
      startTimer(quizDuration);
    } catch (error) {
      toast.error('Error fetching quiz data');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchQuizData();
    handleFullScreenPrompt();
    const storedAnswers = localStorage.getItem(`quizAnswers_${quizId}`);
    if (storedAnswers) {
      setUserAnswers(JSON.parse(storedAnswers)); 
    }
    document.addEventListener('fullscreenchange', handleFullScreenExit);
    document.addEventListener('visibilitychange', handleTabSwitch);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenExit);
      document.removeEventListener('visibilitychange', handleTabSwitch);
      clearInterval(timerRef.current);
    };
  }, []);

  const handleFullScreenPrompt = () => {
    if (!document.fullscreenElement) {
      
    }
  };

  const handleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  const handleFullScreenExit = () => {
    if (!document.fullscreenElement) {
      window.location.reload();
    }
  };

  const handleTabSwitch = () => {
    if (document.visibilityState === 'hidden') {
      setTabSwitchCount((prevCount) => prevCount + 1);
      toast.error('You switched tabs! Be careful, the quiz may auto-submit.');
    }
  };

  useEffect(() => {
    if (tabSwitchCount >= 2) {
      setPopupReason('tab-switch');
      setShowTimeUpPopup(true);
    }
  }, [tabSwitchCount]);

  
  

  const handleAnswerSelection = (questionIndex, selectedOptionIndex) => {
    setUserAnswers((prevAnswers) => {
      const newAnswers = {
        ...prevAnswers,
        [questionIndex]: selectedOptionIndex,
      };
      localStorage.setItem(`quizAnswers_${quizId}`, JSON.stringify(newAnswers)); 
      return newAnswers;
    });
  };
  


  

  

  const startTimer = (initialTime) => {
    setTimeLeft(initialTime);
    clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {        
        if (prevTime <= 1000) {
          setIsFullScreen(true);
          clearInterval(timerRef.current);
          setPopupReason('time-up');
          setShowTimeUpPopup(true); 
          return 0;
        }
        return prevTime - 1000; 
      });
    }, 1000);
  };

  const formatTime = (timeInMs) => {
    if (timeInMs <= 0) return "0:00"; 
    const totalSeconds = Math.floor(timeInMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleNextQuestion = () => {
    if (selectedQuestion < quizData.questions?.length - 1) {
      setSelectedQuestion(selectedQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (selectedQuestion > 0) {
      setSelectedQuestion(selectedQuestion - 1);
    }
  };

  const calculateScore = () => {
    let score = 0;
    quizData.questions.forEach((question, index) => {
      const selectedAnswer = userAnswers[index];
      if (selectedAnswer !== undefined) {
        const correctAnswer = question.correctAnswer;
        if (selectedAnswer === correctAnswer) {
          score++;
        }
      }
    });
    return score;
  };

  const finishQuiz = async () => {
    try {
      const score = calculateScore();
      const answers = Object.entries(userAnswers).map(([key, value]) => ({
        [`${(parseInt(key) + 1).toString()}`]: value.toString() 
      }));
      console.log(answers);
      const response = await api.post(
        '/quiz/submit-quiz',
        { quizId,answers, score },
        {
          headers: {
            Authorization: `Bearer ${studentToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        localStorage.removeItem(`quizAnswers_${quizId}`);
        toast.success('Quiz submitted successfully!');
        if (document.fullscreenElement) {
            await document.exitFullscreen();
        }
        navigate('/quiz-completion', { replace: true });
      } else {
        toast.error('Failed to submit the quiz.');
      }
    } catch (error) {
      toast.error('Error submitting quiz: ' + error.message);
      console.error(error);
    }
  };

  const handleProceed = () => {
    setShowTimeUpPopup(false); // Hide the popup
    if (popupReason === 'time-up' || popupReason === 'tab-switch') {
      finishQuiz(); 
    }
  };

  

 


  return (
    <div className="relative max-h-screen bg-white scrollbar-hide">
      <div className="absolute inset-0 text-gray-900 text-4xl font-bold opacity-50 pointer-events-none">
        <div className="watermark">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="watermark-text">
              {userName} - {regNo}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col max-h-screen ">
        {/* Navbar */}
        <div className="flex top-0 sticky items-center justify-between p-3 bg-blue-600 text-white">
          <div className='flex flex-row gap-10 items-center'>
            <p className="text-md">Name : {userName}</p>
            <p className="text-md">Roll No: {regNo}</p>
            <p className="text-md">Faculty: {facultyData.name}</p>
          </div>
          <div className="text-lg">
            <span>Time Left: {formatTime(timeLeft)}</span>
            <button onClick={finishQuiz} className="bg-red-500 text-white px-4 py-2 ml-4 rounded-md">
              Finish Quiz
            </button>
          </div>
        </div>

        <div className="flex flex-grow ">
          {/* Question List Sidebar */}
          <div className="bg-blue-100 p-4 w-1/5 border-r border-gray-300 overflow-y-scroll scrollbar-hide h-screen ">
            <h3 className="text-xl text-blue-800 font-bold mb-4">Questions</h3>
            <ul className=''>
              {quizData.questions?.map((_, index) => (
                <li
                  key={index}
                  onClick={() => setSelectedQuestion(index)}
                  className={`p-2 mb-2 text-center cursor-pointer rounded ${
                    userAnswers[index]
                      ? 'bg-green-500 text-white'
                      : selectedQuestion === index
                      ? 'bg-green-300'
                      : 'bg-gray-300'
                  }`}
                >
                  Question {index + 1}
                </li>
              ))}
            </ul>
          </div>

          {/* Question and Options */}
          <div className="flex-1 p-8 max-h-screen overflow-y-scroll scrollbar-hide">
            {quizData.questions && quizData.questions[selectedQuestion] ? (
              <>
                <h2 className="text-2xl mb-4">{"Q"}{selectedQuestion+1}{")"}.  {quizData.questions[selectedQuestion]?.questionText}</h2>
                <div className="flex flex-col gap-4">
                  {Object.values(quizData.questions[selectedQuestion]?.options).map((option, idx) => (
                    <button
                      key={idx}
                      className={`p-4 rounded-lg px-6 flex border items-start ${
                        userAnswers[selectedQuestion] === idx + 1
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100'
                      }`}
                      onClick={() => handleAnswerSelection(selectedQuestion, idx + 1)}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                
              </>
            ) : (
              <div className='flex h-screen w-full justify-center items-center'>
                <CircularProgress className='text-8xl' /> 
              </div>
            )}
          </div>
          
        </div>
        <div className='bottom-0 sticky w-full bg-white'>
        
            <div className='flex flex-row '>
            <div className='flex flex-row justify-center items-center w-1/5 py-3 px-3'>
              <p>Questions Answered : {Object.keys(userAnswers).length}/{questionsLength}</p>
            </div>
            <div className=" flex justify-between w-4/5 px-8 py-3">
                  <button
                    className="bg-gray-300 px-4 py-2 rounded"
                    onClick={handlePreviousQuestion}
                    disabled={selectedQuestion === 0}
                  >
                    Previous
                  </button>
                  <button
                    className="bg-gray-300 px-4 py-2 rounded"
                    onClick={handleNextQuestion}
                  >
                    Next
                  </button>
                </div>
                </div>
                
      </div>
      </div>
      
      {!isFullScreen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl mb-4">Enable Full-Screen Mode</h2>
            <p className="mb-6">The quiz can only be taken in full-screen mode. Please enable it to continue.</p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleFullScreen}>
              Enable Full Screen
            </button>
          </div>
        </div>
      )}

      {/* Popup for Time Up */}
      {showTimeUpPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90">
            <div className="bg-white p-6 rounded h-1/3 w-4/12 shadow-lg">
            <h2 className="text-lg font-bold mb-4">
            {popupReason === 'time-up' ? (
                <>
                    <AccessTimeIcon style={{ fontSize: '30px' }} className="text-xs" />
                    {"Time's Up!"}
                </>
                ) : (
                "Tab Switch Limit Reached!"
                )}

            </h2>
            <p>
                {popupReason === 'time-up'
                ? "Your time has expired. Your answers are saved successfully."
                : "You have switched tabs too many times. Your answers are saved automatically."}
            </p>
            <p>Please proceed to submit your quiz.</p>
            <button onClick={handleProceed} className="bg-blue-500 text-white px-4 py-2 mt-4 rounded">
                Proceed
            </button>
            </div>
        </div>
        )}

      
      <Toaster />
    </div>
  );
};

export default QuizPage;
