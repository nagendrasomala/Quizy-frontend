import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css'
import StartPage from './Components/startingPage'
import AdminLogin from './Components/adminlogin';
import AdminDashboard from './Components/adminDashboard';
import OrganizationPage from './Components/organizationPage';
import ClassesPage from './Components/classPage';
import CreateOrganization from './Components/createOrg';
import ManageStudentsPage from './Components/adminStudentPage';
import FacultyLogin from './Components/facultyLogin';
import StudentLogin from './Components/studentLogin';
import FacultyDashboard from './Components/facultyDashboard';
import FacultyClassesPage from './Components/facultyClasses';
import QuizListPage from './Components/facultyQuizes';
import QuizCreator from './Components/createQuiz';
import StudentDashboard from './Components/studentDashboard';
import SOrganizationsPage from './Components/studentOrganizations';
import SQuizListPage from './Components/studentQuiz';
import StudentClassesPage from './Components/studentClasses';
import StudentClassQuizListPage from './Components/studentQuizzesPage';
import QuizPage from './Components/takeQuizPage';
import QuizCompletion from './Components/submitPage';




function App() {
  
  return (
    <>
    <Router>
      <div className="min-h-screen bg-blue-100">
        <Routes>
          {/* Home Route */}
          <Route path="/" element={<StartPage />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path='/admin-dashboard' element={<AdminDashboard/>}/>
          
          <Route path="/organizations" element={<OrganizationPage />} />
          <Route path="/create-organizations" element={<CreateOrganization />} />
          <Route path="/classes" element={<ClassesPage />} />
          <Route path='/manage-students' element={<ManageStudentsPage/>}/>
          <Route path="/faculty-login" element={<FacultyLogin />} />
          <Route path='/faculty-dashboard' element={<FacultyDashboard/>}/>
          <Route path='/faculty-classes' element={<FacultyClassesPage/>}/>
          <Route path='/faculty-quizes' element={<QuizListPage/>}/>
          <Route path='/create-quizes' element={<QuizCreator/>}/>

          <Route path="/student-login" element={<StudentLogin />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/student-organizations" element={<SOrganizationsPage />} />
          <Route path="/student-quizzes" element={<SQuizListPage />} />
          <Route path="/student-classes" element={<StudentClassesPage />} />
          <Route path="/student-classes-quiz" element={<StudentClassQuizListPage />} />
          <Route path="/student-take-quiz" element={<QuizPage />} />
          <Route path="/quiz-completion" element={<QuizCompletion/>} />
        </Routes>
      </div>
    </Router>
      
    </>
  )
}

export default App
