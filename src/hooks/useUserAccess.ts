
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { subscriptionService, type Subscription } from '@/services/subscriptionService';
import { usageService } from '@/services/usageService';
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

  const fetchSubscription = useCallback(async (skipExpiryCheck = false) => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    // Admin users get automatic lifetime access
    if (isAdminUser) {
      setSubscription({
        id: "admin-access",
        plan_type: "lifetime",
        expires_at: null,
        is_active: true
      });
      setLoading(false);
      return;
    }

    try {
      // Check and expire subscription first (unless we're skipping it to avoid loops)
      if (!skipExpiryCheck) {
        await checkAndExpireUserSubscription(user.id);
      }

      // Fetch current subscription after expiry check
      const userSubscription = await subscriptionService.fetchUserSubscription(user.id);
      setSubscription(userSubscription);
    } catch (error) {
      console.error('Error fetching subscription:', error);
      setSubscription(subscriptionService['getDefaultFreeSubscription']());
    } finally {
      setLoading(false);
    }
  }, [user, isAdminUser, checkAndExpireUserSubscription]);

  const fetchUsageCount = useCallback(async () => {
    if (!user) return;
    
    try {
      const count = await usageService.fetchUsageCount(user.id, 'bio_generator');
      setUsageCount(count);
    } catch (error) {
      console.error('Error fetching usage count:', error);
    }
  }, [user]);

  // Initial fetch when user changes
  useEffect(() => {
    if (user) {
      fetchSubscription();
      fetchUsageCount();
    } else {
      setSubscription(null);
      setUsageCount(0);
      setLoading(false);
    }
  }, [user, fetchSubscription, fetchUsageCount]);

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
      fetchSubscription();
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
      fetchSubscription();
    }, checkInterval);

    return () => clearInterval(interval);
  }, [subscription, fetchSubscription]);

  const canUseTool = useCallback((toolType: 'cover_letter' | 'bio_generator'): boolean => {
    if (!user) return false;
    return usageService.canUseTool(toolType, subscription, isAdminUser, usageCount);
  }, [user, subscription, isAdminUser, usageCount]);

  const recordUsage = useCallback(async (toolType: 'cover_letter' | 'bio_generator') => {
    if (!user) return;

    try {
      const success = await usageService.recordUsage(user.id, toolType);
      if (success) {
        await fetchUsageCount();
      }
    } catch (error) {
      console.error('Error recording usage:', error);
    }
  }, [user, fetchUsageCount]);

  const refetch = useCallback(async () => {
    await fetchSubscription(false); // false = don't skip expiry check
  }, [fetchSubscription]);

  const getRemainingTime = useCallback(() => {
    return subscriptionService.getRemainingTime(subscription?.expires_at || null);
  }, [subscription]);

  const getPlanDisplayName = useCallback(() => {
    return subscriptionService.getPlanDisplayName(subscription?.plan_type || 'free', isAdminUser);
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
