
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';

interface UsageCounterProps {
  toolType: 'cover_letter' | 'bio_generator';
  toolDisplayName: string;
}

const UsageCounter: React.FC<UsageCounterProps> = ({ toolType, toolDisplayName }) => {
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const [todaysUsage, setTodaysUsage] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTodaysUsage();
    }
  }, [user, subscription]);

  const fetchTodaysUsage = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('tool_usage')
        .select('*')
        .eq('user_id', user.id)
        .eq('tool_type', toolType)
        .eq('usage_date', new Date().toISOString().split('T')[0]);

      if (error) throw error;
      setTodaysUsage(data?.length || 0);
    } catch (error) {
      console.error('Error fetching usage:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !user) return null;

  const getUsageLimit = () => {
    if (!subscription) return 1;
    
    switch (subscription.plan_type) {
      case 'free':
        return 1;
      case 'daily':
      case 'monthly':
      case 'lifetime':
        return Infinity;
      default:
        return 1;
    }
  };

  const limit = getUsageLimit();
  const isUnlimited = limit === Infinity;

  if (isUnlimited) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
        <p className="text-sm text-green-800">
          ✓ <strong>Unlimited {toolDisplayName}</strong> - {subscription?.plan_type} plan
        </p>
      </div>
    );
  }

  const isAtLimit = todaysUsage >= limit;

  return (
    <div className={`border rounded-lg p-3 mb-6 ${isAtLimit ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
      <p className={`text-sm ${isAtLimit ? 'text-red-800' : 'text-blue-800'}`}>
        {isAtLimit ? '⚠️' : 'ℹ️'} You've used <strong>{todaysUsage} of {limit}</strong> free {toolDisplayName.toLowerCase()}s today.
        {isAtLimit && (
          <span className="block mt-1 font-medium">
            Daily limit reached. Upgrade to continue using this tool.
          </span>
        )}
      </p>
    </div>
  );
};

export default UsageCounter;
