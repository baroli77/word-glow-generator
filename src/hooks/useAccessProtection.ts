
import { useEffect } from 'react';
import { useRouter } from 'next/router';

interface User {
  access_expires_at?: string | null;
  [key: string]: any;
}

const useAccessProtection = (user: User | null | undefined) => {
  const router = useRouter();

  useEffect(() => {
    // Skip checks during initial loading or if already on auth/pricing pages
    if (
      router.pathname === '/login' || 
      router.pathname === '/pricing' ||
      !router.isReady
    ) {
      return;
    }

    // Check if user is missing
    if (!user) {
      router.push('/login');
      return;
    }

    // Check if user has access expiration and if it's expired
    if (user.access_expires_at) {
      const expirationDate = new Date(user.access_expires_at);
      const currentDate = new Date();
      
      if (currentDate > expirationDate) {
        router.push('/pricing');
        return;
      }
    }
  }, [user, router]);
};

export default useAccessProtection;
