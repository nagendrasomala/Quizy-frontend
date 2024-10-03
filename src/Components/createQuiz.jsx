import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import api from '../assets/api';
import { useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const QuizCreator = () => {
    
  const location = useLocation();
  const [questions, setQuestions] = useState([]);
  const [quizTitle, setQuizTitle] = useState('');
  const [date, setDate] = useState('');
  const { classId } = location.state || {};
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // Function to convert local time to IST (UTC +5:30)
  const toIST = (date) => {
    const offsetIST = 5 * 60 + 30; // IST is UTC + 5 hours and 30 minutes
    const istDate = new Date(date.getTime() + (offsetIST - date.getTimezoneOffset()) * 60 * 1000);
    return istDate.toISOString().slice(0, 16); // Format in YYYY-MM-DDTHH:mm for input[type="datetime-local"]
  };

  // Function to format time in HH:mm
  const formatTimeHHMM = (date) => {
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  // Handle file upload and parse questions from Excel file
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });

      // Get the first sheet
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      // Convert the sheet to JSON format
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Map the data to match your backend format
      const formattedData = jsonData.map(item => ({
        question: item.question,
        opt1: item.opt1,
        opt2: item.opt2,
        opt3: item.opt3,
        opt4: item.opt4,
        correctAnswer: item.correctAnswer,
      }));

      setQuestions(formattedData);
    };

    reader.readAsBinaryString(file);
  };

  // Handle quiz creation
  const handleQuizCreation = async () => {
    const token = localStorage.getItem('faculty_token');
  
    try {
      const response = await api.post('/faculty/create-quiz', { 
        title: quizTitle, 
        classId: classId,
        startTime: formatTimeHHMM(new Date(startTime)), // Sending in HH:mm format
        endTime: formatTimeHHMM(new Date(endTime)),     // Sending in HH:mm format
        scheduledDate: date,
        questions,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
      });
  
      toast.success('Quiz created successfully!');
      setQuestions([]); 
      setQuizTitle(''); 
      setDate(''); 
      setStartTime(''); 
      setEndTime(''); 
    } catch (error) {
      console.error('Error creating quiz:', error);
      toast.error('Error creating quiz. Please try again later.');
    }
  };

  return (
    <div className='flex-flex-col p-6'>
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto mt-10">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Create a Quiz</h1>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Quiz Title"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            className="p-2 rounded-md bg-slate-100 shadow-md w-full"
            required
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="p-2 rounded-md bg-slate-100 shadow-md w-full"
            required
          />
          <div className="flex flex-col md:flex-row gap-4">
            <label className="w-full">
              Start Time (IST):
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="p-2 rounded-md bg-slate-100 shadow-md w-full"
              />
            </label>
            <label className="w-full">
              End Time (IST):
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="p-2 rounded-md bg-slate-100 shadow-md w-full"
              />
            </label>
          </div>
          <input
            type="file"
            onChange={handleFileUpload}
            accept=".xlsx, .xls"
            className="p-2 rounded-md bg-slate-100 shadow-md w-full"
          />
          
          <h2 className="text-2xl font-bold text-gray-700 mt-6">Questions Preview</h2>

          {/* Render questions in card format */}
          <div className="grid grid-cols-1 gap-6">
            {questions.map((q, index) => (
              <div key={index} className="bg-gray-100 p-4 rounded-md shadow-md">
                <h3 className="font-bold text-lg text-blue-600">Question {index + 1}: {q.question}</h3>
                <ul className="mt-2">
                  <li className="mt-1"><strong>1. </strong>{q.opt1}</li>
                  <li className="mt-1"><strong>2. </strong>{q.opt2}</li>
                  <li className="mt-1"><strong>3. </strong>{q.opt3}</li>
                  <li className="mt-1"><strong>4. </strong>{q.opt4}</li>
                </ul>
                <p className="mt-2 text-green-600"><strong>Correct Answer: </strong>{q.correctAnswer}</p>
              </div>
            ))}
          </div>

          <button
            onClick={handleQuizCreation}
            className="bg-blue-500 text-white p-3 rounded-md w-full hover:bg-blue-600 mt-6"
          >
            Create Quiz
          </button>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default QuizCreator;
