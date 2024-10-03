import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

// Admin Private Route
const AdminPrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const admin_token = localStorage.getItem('admin_token');
    if (!admin_token) {
      setIsAuthenticated(false);
      return;
    }

    axios.post('http://localhost:7080/token/test-admin', {}, {
      headers: { Authorization: `Bearer ${admin_token}` }
    })
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false));
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/" />;
};

// Faculty Private Route
const FacultyPrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const faculty_token = localStorage.getItem('faculty_token');
    if (!faculty_token) {
      setIsAuthenticated(false);
      return;
    }

    axios.post('http://localhost:7080/token/test-faculty', {}, {
      headers: { Authorization: `Bearer ${faculty_token}` }
    })
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false));
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/" />;
};

// Student Private Route
const StudentPrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const student_token = localStorage.getItem('student_token');
    if (!student_token) {
      setIsAuthenticated(false);
      return;
    }

    axios.post('http://localhost:7080/token/test-student', {}, {
      headers: { Authorization: `Bearer ${student_token}` }
    })
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false));
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/" />;
};

const PublicRoute = ({ children, role }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    // Check for conflicting tokens
    const admin_token = localStorage.getItem('admin_token');
    const faculty_token = localStorage.getItem('faculty_token');
    const student_token = localStorage.getItem('student_token');

    if (role === "admin" && (faculty_token || student_token)) {
      // Clear other tokens for admin login
      localStorage.removeItem('faculty_token');
      localStorage.removeItem('student_token');
    } else if (role === "faculty" && (admin_token || student_token)) {
      // Clear other tokens for faculty login
      localStorage.removeItem('admin_token');
      localStorage.removeItem('student_token');
    } else if (role === "student" && (admin_token || faculty_token)) {
      // Clear other tokens for student login
      localStorage.removeItem('admin_token');
      localStorage.removeItem('faculty_token');
    }

    const token = localStorage.getItem(`${role}_token`);
    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    axios.post(`http://localhost:7080/token/test-${role}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false));
  }, [role]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return !isAuthenticated ? children : <Navigate to={`/${role}-dashboard`} />;
};


export { AdminPrivateRoute, FacultyPrivateRoute, StudentPrivateRoute, PublicRoute };
