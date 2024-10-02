import React from 'react';
import { useNavigate } from 'react-router-dom';
import './submitQuiz.css'; 

const QuizCompletion = () => {
    const navigate = useNavigate();

    const handleGoToDashboard = () => {
        navigate('/student-dashboard', { replace: true }); 
    };

    return (
        <div className="quiz-completion-container">
            <div className="tick-animation">
                <svg viewBox="0 0 52 52" className="checkmark">
                    <circle className="circle" cx="26" cy="26" r="25" />
                    <path className="check" d="M16 27l7 7 15-15" />
                </svg>
            </div>
            <h2 className="completion-message">Quiz Submitted Successfully!</h2>
            <button className="go-to-dashboard-button" onClick={handleGoToDashboard}>
                Go to Dashboard
            </button>
        </div>
    );
};

export default QuizCompletion;
