import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import api from '../assets/api';
import { useLocation } from 'react-router-dom';

const QuizCreator = () => {
    
  const location = useLocation();
  const [questions, setQuestions] = useState([]);
  const [quizTitle, setQuizTitle] = useState('');
  const [date, setDate] = useState('');
  const { classId:classId } = location.state || {};
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date(Date.now() + 3600000));

  

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

      // Set the structured data in state
      setQuestions(formattedData);
    };

    reader.readAsBinaryString(file);
  };

 

  const handleQuizCreation = async () => {
    const token = localStorage.getItem('faculty_token');
  
    try {
      const response = await api.post('/faculty/create-quiz', { 
        title: quizTitle, 
        classId: classId,
        startTime,
        endTime,
        scheduledDate: date,
        questions,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the token
        },
      });
  
      alert('Quiz created successfully!');
      setQuestions([]); 
      setQuizTitle(''); 
      setDate(''); 
      setStartTime(new Date()); 
      setEndTime(new Date(Date.now() + 3600000)); 
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert('Error creating quiz. Please try again later.');
    }
  };
  


  return (
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
          placeholder="Quiz Title"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="p-2 rounded-md bg-slate-100 shadow-md w-full"
          required
        />
        <div className="flex flex-col md:flex-row gap-4">
          <label className="w-full">
            Start Time:
            <input
              type="datetime-local"
              value={startTime.toISOString().slice(0, -1)}
              onChange={(e) => setStartTime(new Date(e.target.value))}
              className="p-2 rounded-md bg-slate-100 shadow-md w-full"
            />
          </label>
          <label className="w-full">
            End Time:
            <input
              type="datetime-local"
              value={endTime.toISOString().slice(0, -1)}
              onChange={(e) => setEndTime(new Date(e.target.value))}
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
        <pre className="bg-slate-100 p-4 rounded-md shadow-md overflow-x-auto w-full">{JSON.stringify(questions, null, 2)}</pre>
        <button
          onClick={handleQuizCreation}
          className="bg-blue-500 text-white p-3 rounded-md w-full hover:bg-blue-600"
        >
          Create Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizCreator;
