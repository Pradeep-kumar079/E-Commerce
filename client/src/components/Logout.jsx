import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear token or any session-related data
    localStorage.removeItem('token'); // or sessionStorage.removeItem('token')
    
    // // Optional: clear other data like user info
    // localStorage.removeItem('user');

    // Redirect to login
    navigate('/login');
  }, [navigate]);

  return (
    <div>
      <h2>Logging out...</h2>
    </div>
  );
};

export default Logout;
