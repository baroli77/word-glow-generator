
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {
  Calendar, Clock, Crown, CreditCard, AlertTriangle, CheckCircle
} from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { subscriptionService } from '@/services/subscriptionService';
import { useAuth } from '@/context/AuthContext';
import { toast } from "@/components/ui/use-toast";

const SubscriptionManagement: React.FC = () => {
  const { user } = useAuth();
  const { subscription, getRemainingTime, getPlanDisplayName, refetch } = useSubscription();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  if (!subscription || subscription.plan_type === 'free') {
    return null;
  }

  const handleCancelSubscription = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const success = await subscriptionService.cancelSubscription(user.id);
      if (success) await refetch();
    } catch (error) {
      console.error('Error cancelling subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResubscribe = () => navigate('/pricing');

  const getPlanIcon = () => {
    switch (subscription.plan_type) {
      case 'daily': return <Clock className="h-5 w-5" />;
      case 'monthly': return <Calendar className="h-5 w-5" />;
      case 'lifetime': return <Crown className="h-5 w-5" />;
      default: return <CreditCard className="h-5 w-5" />;
    }
  };

  return (
    <Card className="w-full bg-background border border-muted">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getPlanIcon()}
          Subscription Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Current Plan</p>
            {subscription.is_cancelled && (
              <Badge variant="destructive">Cancelled</Badge>
            )}
          </div>
          <p className="text-base font-medium capitalize">
            {getPlanDisplayName(subscription.plan_type)}
          </p>
        </div>

        {subscription.expires_at && (
          <div className="rounded-md border border-yellow-700 bg-yellow-950 p-4 text-yellow-300">
            <div className="flex items-center gap-2 text-sm font-medium mb-1">
              <AlertTriangle className="h-4 w-4" />
              Subscription Ends
            </div>
            <p className="text-sm">
              {new Date(subscription.expires_at).toLocaleString(undefined, {
                weekday: 'long', year: 'numeric', month: 'long',
                day: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
            </p>
            <p className="text-sm text-red-400 mt-1">
              You&apos;ll retain access until this date, then be moved to the free plan.
            </p>
          </div>
        )}

        <div>
          <p className="text-sm font-semibold mb-2">Your Plan Includes:</p>
          <ul className="space-y-3 mt-4 list-none">
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 mt-1 text-green-500 shrink-0" />
              <span className="text-sm leading-snug text-white">Unlimited bio generation</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 mt-1 text-green-500 shrink-0" />
              <span className="text-sm leading-snug text-white">Unlimited cover letter generation</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 mt-1 text-green-500 shrink-0" />
              <span className="text-sm leading-snug text-white">All platform types available</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 mt-1 text-green-500 shrink-0" />
              <span className="text-sm leading-snug text-white">Priority support</span>
            </li>
          </ul>
        </div>

        {subscription.is_cancelled && (
          <p className="text-xs text-muted-foreground text-center pt-4">
            Your subscription has been cancelled but remains active until the end date.
          </p>
        )}

        <Button onClick={handleResubscribe} className="w-full mt-4" disabled={isLoading}>
          Resubscribe
        </Button>
      </CardContent>
    </Card>
  );
};

export default SubscriptionManagement;
