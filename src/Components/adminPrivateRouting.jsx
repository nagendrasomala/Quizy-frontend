import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
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

  export default AdminPrivateRoute;