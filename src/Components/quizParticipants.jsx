import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../assets/api';
import * as XLSX from 'xlsx'; // Update import

const ParticipantsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [participants, setParticipants] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [quizName, setQuizName] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [isOpen, setIsOpen] = useState(false);
    

    // Get quizId from location.state
    const quizId = location.state?.quizId;

    // Redirect or handle missing quizId
    useEffect(() => {
        if (!quizId) {
            navigate('/faculty-dashboard'); // Redirect if quizId is missing
        }
    }, [quizId, navigate]);

    useEffect(() => {
        const fetchParticipants = async () => {
            try {
                const faculty_token = localStorage.getItem('faculty_token');
                const response = await api.post('/quiz/faculty/students-participated',
                    { quizId },
                    { headers: { Authorization: `Bearer ${faculty_token}` } }
                );
                setQuizName(response.data.data[0].quizTitle);
                setParticipants(response.data.data);
            } catch (error) {
                console.error('Error fetching participants:', error);
            }
        };

        if (quizId) {
            fetchParticipants();
        }
    }, [quizId]);

    // Function to filter participants by regNo or Name
    const filteredParticipants = participants.filter(
        (participant) =>
            participant.regNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            participant.studentName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Function to sort participants by Marks
    const sortedParticipants = filteredParticipants.sort((a, b) => {
        return sortOrder === 'asc' ? a.score - b.score : b.score - a.score;
    });

    // Function to toggle sort order
    const toggleSortOrder = () => {
        setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
    };

    // Function to download the Excel file
    const downloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(sortedParticipants.map(({ regNo, studentName, score }) => ({
            'Reg No': regNo,
            'Name': studentName,
            'Marks': score,
        })));
        
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Participants');

        // Create an Excel file and trigger download
        XLSX.writeFile(workbook, `${quizName}_Participants.xlsx`);
    };

    // Function to handle logout
    const handleLogout = () => {
        localStorage.removeItem('faculty_token');
        navigate("/faculty-login");
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Top Bar */}
            <div className="bg-blue-600 flex items-center h-16 w-full">
                <h1 className="text-3xl text-white flex justify-start ml-5">Quizy</h1>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-row w-full min-h-screen">
                {/* Sidebar (Hamburger Menu) */}
                <div className={`bg-blue-400 p-4 text-white ${isOpen ? 'w-64' : 'w-16'} transition-all`}>
                    <button className="focus:outline-none text-xl" onClick={() => setIsOpen(!isOpen)}>
                        ☰
                    </button>
                    {isOpen && (
                        <div className="mt-4">
                            <button
                                className="block py-2 rounded-md hover:bg-blue-700 w-full"
                                onClick={() => navigate('/faculty-dashboard', { state: { currentPage: 'classes' } })}
                            >
                                My Classes
                            </button>
                            <button
                                className="block py-2 rounded-md hover:bg-blue-700 w-full"
                                onClick={() => navigate('/faculty-dashboard', { state: { currentPage: 'quizzes' } })}
                            >
                                My Quizzes
                            </button>
                            <button
                                className="block py-2 rounded-md hover:bg-blue-700 w-full"
                                onClick={() => window.open('https://question-paper-gen.vercel.app/', '_self')}
                            >
                                Generate Qp
                            </button>
                            <button
                                className="block py-2 rounded-md hover:bg-blue-700 mt-4 w-full"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>

                {/* Right Side Content */}
                <div className="flex-1 p-5 bg-white">
                    <div className='flex flex-row justify-between items-center'>
                        <h1 className="text-2xl font-bold mb-4">Participants of {quizName} Quiz</h1>

                        <div className="flex mb-4 flex flex-row items-center w-6/12 justify-end">
                            <input
                                type="text"
                                placeholder="Search by RegNo or Name"
                                className="border p-2 rounded mr-4 w-7/12"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button onClick={toggleSortOrder} className="bg-blue-500 text-white p-2 rounded">
                                Sort by Marks {sortOrder === 'asc' ? '↑' : '↓'}
                            </button>
                            <button onClick={downloadExcel} className="bg-blue-500 text-white p-2 rounded ml-2">
                                Download Excel
                            </button>
                        </div>
                    </div>

                    <table className="w-10/12 bg-white border border-gray-300 ">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b text-center">RegNo</th>
                                <th className="py-2 px-4 border-b text-center">Name</th>
                                <th className="py-2 px-4 border-b text-center">Marks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedParticipants.map((participant) => (
                                <tr key={participant.regNo}>
                                    <td className="py-2 px-4 border-b text-center">{participant.regNo}</td>
                                    <td className="py-2 px-4 border-b text-center">{participant.studentName}</td>
                                    <td className="py-2 px-4 border-b text-center">{participant.score}/{participant.totalMarks}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ParticipantsPage;
