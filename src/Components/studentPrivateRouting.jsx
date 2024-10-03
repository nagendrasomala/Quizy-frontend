import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

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

  
  export default StudentPrivateRoute;