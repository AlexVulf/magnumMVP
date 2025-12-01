import { useState, useEffect } from 'react';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setIsAuthenticated(true);
        setUserRole(payload.role);
      } catch (e) {
        setIsAuthenticated(false);
        setUserRole(null);
      }
    }
  }, []);

  return { isAuthenticated, userRole };
};

export default useAuth;
