
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { subscriptionService, type Subscription } from '@/services/subscriptionService';
import { userAccessService } from '@/services/userAccessService';
import { useSubscriptionExpiry } from './useSubscriptionExpiry';

interface UserAccessState {
  user: any;
  subscription: Subscription | null;
  usageCount: number;
  loading: boolean;
  isAdminUser: boolean;
}

interface UserAccessActions {
  canUseTool: (toolType: 'cover_letter' | 'bio_generator') => boolean;
  recordUsage: (toolType: 'cover_letter' | 'bio_generator') => Promise<void>;
  refetch: () => Promise<void>;
  getRemainingTime: () => string | null;
  getPlanDisplayName: () => string;
}

export const useUserAccess = (): UserAccessState & UserAccessActions => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { checkAndExpireUserSubscription } = useSubscriptionExpiry();
  
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [usageCount, setUsageCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Check if user is admin
  const isAdminUser = user?.email === 'obarton77@gmail.com';

  // Unified access protection logic
  useEffect(() => {
    const protectedRoutes = ['/bio-generator', '/cover-letter', '/dashboard'];
    const isOnProtectedRoute = protectedRoutes.some(route => 
      location.pathname.startsWith(route)
    );
    
    if (!isOnProtectedRoute) return;

    // Skip checks if already on auth/pricing pages
    if (location.pathname === '/login' || location.pathname === '/pricing') {
      return;
    }

    // Check if user is missing
    if (!user) {
      navigate('/login');
      return;
    }

    // Check subscription expiry for non-admin users
    if (!isAdminUser && subscription && subscription.expires_at) {
      const expirationDate = new Date(subscription.expires_at);
      const currentDate = new Date();
      
      if (currentDate > expirationDate) {
        navigate('/pricing');
        return;
      }
    }
  }, [user, subscription, navigate, location, isAdminUser]);

  const fetchData = useCallback(async (skipExpiryCheck = false) => {
    if (!user) {
      setSubscription(null);
      setUsageCount(0);
      setLoading(false);
      return;
    }

    console.log('Fetching user access data for user:', user.email);

    // Admin users get automatic lifetime access
    if (isAdminUser) {
      console.log('Admin user detected, setting lifetime access');
      setSubscription({
        id: "admin-access",
        plan_type: "lifetime",
        expires_at: null,
        is_active: true
      });
      setUsageCount(0);
      setLoading(false);
      return;
    }

    try {
      // Check and expire subscription first (unless we're skipping it to avoid loops)
      if (!skipExpiryCheck) {
        console.log('Checking subscription expiry...');
        await checkAndExpireUserSubscription(user.id);
      }

      // Fetch user access data using the new service
      console.log('Fetching subscription and usage data...');
      const accessData = await userAccessService.getUserAccessData(user.id, isAdminUser);
      
      console.log('Access data received:', {
        subscription: accessData.subscription,
        usageCount: accessData.usageCount
      });
      
      setSubscription(accessData.subscription);
      setUsageCount(accessData.usageCount);
    } catch (error) {
      console.error('Error fetching user access data:', error);
      setSubscription(subscriptionService['getDefaultFreeSubscription']());
      setUsageCount(0);
    } finally {
      setLoading(false);
    }
  }, [user, isAdminUser, checkAndExpireUserSubscription]);

  // Initial fetch when user changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Set up automatic revalidation for time-based subscriptions
  useEffect(() => {
    if (!subscription || !subscription.expires_at) {
      return;
    }

    const expiresAt = new Date(subscription.expires_at);
    const now = new Date();
    const timeUntilExpiry = expiresAt.getTime() - now.getTime();

    // If already expired, check immediately
    if (timeUntilExpiry <= 0) {
      fetchData();
      return;
    }

    // For daily subscriptions, check more frequently as they approach expiry
    let checkInterval: number;
    if (subscription.plan_type === 'daily') {
      // Check every minute if expiring within an hour, otherwise every 10 minutes
      checkInterval = timeUntilExpiry <= 60 * 60 * 1000 ? 60 * 1000 : 10 * 60 * 1000;
    } else {
      // For monthly plans, check every hour
      checkInterval = 60 * 60 * 1000;
    }

    const interval = setInterval(() => {
      fetchData();
    }, checkInterval);

    return () => clearInterval(interval);
  }, [subscription, fetchData]);

  // Auto-refresh when returning to the app (e.g., after checkout)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        console.log('Page became visible, refreshing subscription data...');
        fetchData();
      }
    };

    const handleFocus = () => {
      if (user) {
        console.log('Window focused, refreshing subscription data...');
        fetchData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [user, fetchData]);

  const canUseTool = useCallback((toolType: 'cover_letter' | 'bio_generator'): boolean => {
    if (!user) return false;
    return userAccessService.canUseTool(toolType, subscription, isAdminUser, usageCount);
  }, [user, subscription, isAdminUser, usageCount]);

  const recordUsage = useCallback(async (toolType: 'cover_letter' | 'bio_generator') => {
    if (!user) return;

    try {
      const success = await userAccessService.recordToolUsage(user.id, toolType);
      if (success) {
        await fetchData();
      }
    } catch (error) {
      console.error('Error recording usage:', error);
    }
  }, [user, fetchData]);

  const refetch = useCallback(async () => {
    console.log('Manual refetch requested');
    await fetchData(false); // false = don't skip expiry check
  }, [fetchData]);

  const getRemainingTime = useCallback(() => {
    return userAccessService.getRemainingTime(subscription?.expires_at || null);
  }, [subscription]);

  const getPlanDisplayName = useCallback(() => {
    return userAccessService.getPlanDisplayName(subscription?.plan_type || 'free', isAdminUser);
  }, [subscription, isAdminUser]);

  return {
    user,
    subscription,
    usageCount,
    loading,
    isAdminUser,
    canUseTool,
    recordUsage,
    refetch,
    getRemainingTime,
    getPlanDisplayName
  };
};
