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

          <Route path="/student-login" element={<StudentLogin />} />
        </Routes>
      </div>
    </Router>
      
    </>
  )
}

export default App
