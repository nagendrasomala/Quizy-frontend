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
import ParticipantsPage from './Components/quizParticipants';
import { AdminPrivateRoute, FacultyPrivateRoute, StudentPrivateRoute,PublicRoute, SuperAdminPrivateRoute } from "./Components/privateRouting";
import StudentQuizResultPage from "./Components/studentResultPage";
import SuperAdminLogin from "./Components/superAdminLogin";
import SuperAdminDashboard from "./Components/superadminDashboard";
import AdminsPage from "./Components/AdminsList";

//import { AdminPrivateRoute, FacultyPrivateRoute, StudentPrivateRoute, PublicRoute } from './privateRouting';



function App() {
  return (
    <Router>
      <div className="min-h-screen bg-blue-100">
        <Routes>
          {/* Home Route */}
          <Route path="/" element={<StartPage />} />

          <Route path="/superadmin-login" element={<PublicRoute role="superadmin"><SuperAdminLogin /></PublicRoute>} />
          <Route path='/super-admin-dashboard' element={<SuperAdminPrivateRoute><SuperAdminDashboard /></SuperAdminPrivateRoute>} />
          <Route path="/create-organizations" element={<SuperAdminPrivateRoute><CreateOrganization /></SuperAdminPrivateRoute>} />
          <Route path="/admins-list" element={<SuperAdminPrivateRoute><AdminsPage /></SuperAdminPrivateRoute>} />



          {/* Admin Routes */}
          <Route path="/admin-login" element={<PublicRoute role="admin"><AdminLogin /></PublicRoute>} />
          <Route path='/admin-dashboard' element={<AdminPrivateRoute><AdminDashboard /></AdminPrivateRoute>} />
          <Route path="/organizations" element={<AdminPrivateRoute><OrganizationPage /></AdminPrivateRoute>} />
          <Route path="/classes" element={<AdminPrivateRoute><ClassesPage /></AdminPrivateRoute>} />
          <Route path='/manage-students' element={<AdminPrivateRoute><ManageStudentsPage /></AdminPrivateRoute>} />

          {/* Faculty Routes */}
          <Route path="/faculty-login" element={<PublicRoute role="faculty"><FacultyLogin /></PublicRoute>} />
          <Route path='/faculty-dashboard' element={<FacultyPrivateRoute><FacultyDashboard /></FacultyPrivateRoute>} />
          <Route path='/faculty-classes' element={<FacultyPrivateRoute><FacultyClassesPage /></FacultyPrivateRoute>} />
          <Route path='/faculty-quizes' element={<FacultyPrivateRoute><QuizListPage /></FacultyPrivateRoute>} />
          <Route path='/create-quizes' element={<FacultyPrivateRoute><QuizCreator /></FacultyPrivateRoute>} />
          <Route path="/quiz-participants" element={<FacultyPrivateRoute><ParticipantsPage /></FacultyPrivateRoute>} />


          {/* Student Routes */}
          <Route path="/student-login" element={<PublicRoute role="student"><StudentLogin /></PublicRoute>} />
          <Route path="/student-dashboard" element={<StudentPrivateRoute><StudentDashboard /></StudentPrivateRoute>} />
          <Route path="/student-organizations" element={<StudentPrivateRoute><SOrganizationsPage /></StudentPrivateRoute>} />
          <Route path="/student-quizzes" element={<StudentPrivateRoute><SQuizListPage /></StudentPrivateRoute>} />
          <Route path="/student-classes" element={<StudentPrivateRoute><StudentClassesPage /></StudentPrivateRoute>} />
          <Route path="/student-classes-quiz" element={<StudentPrivateRoute><StudentClassQuizListPage /></StudentPrivateRoute>} />
          <Route path="/student-take-quiz" element={<StudentPrivateRoute><QuizPage /></StudentPrivateRoute>} />
          <Route path="/quiz-completion" element={<StudentPrivateRoute><QuizCompletion /></StudentPrivateRoute>} />
          <Route path="/quiz-results" element={<StudentPrivateRoute><StudentQuizResultPage /></StudentPrivateRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
