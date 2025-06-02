
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface User {
  access_expires_at?: string | null;
  [key: string]: any;
}

const useAccessProtection = (user: User | null | undefined) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Skip checks if already on auth/pricing pages
    if (
      location.pathname === '/login' || 
      location.pathname === '/pricing'
    ) {
      return;
    }

    // Check if user is missing
    if (!user) {
      navigate('/login');
      return;
    }

    // Check if user has access expiration and if it's expired
    if (user.access_expires_at) {
      const expirationDate = new Date(user.access_expires_at);
      const currentDate = new Date();
      
      if (currentDate > expirationDate) {
        navigate('/pricing');
        return;
      }
    }
  }, [user, navigate, location]);
};

export default useAccessProtection;
