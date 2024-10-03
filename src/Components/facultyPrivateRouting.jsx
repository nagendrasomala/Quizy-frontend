
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';



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

  export default FacultyPrivateRoute;
  