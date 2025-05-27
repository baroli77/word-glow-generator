import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Calendar, Clock, Crown, CreditCard, AlertTriangle, CheckCircle } from 'lucide-react';
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
      if (success) {
        await refetch();
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResubscribe = () => {
    navigate('/pricing');
  };

  const getPlanIcon = () => {
    switch (subscription.plan_type) {
      case 'daily':
        return <Clock className="h-5 w-5" />;
      case 'monthly':
        return <Calendar className="h-5 w-5" />;
      case 'lifetime':
        return <Crown className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const getPlanColor = () => {
    switch (subscription.plan_type) {
      case 'daily':
        return 'bg-blue-500';
      case 'monthly':
        return 'bg-purple-500';
      case 'lifetime':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const remainingTime = getRemainingTime();
  const isCancelled = subscription.subscription_cancelled;

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className={`p-2 rounded-full ${getPlanColor()} text-white`}>
            {getPlanIcon()}
          </div>
          Subscription Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Plan Status */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Current Plan</h3>
              <p className="text-sm text-muted-foreground">{getPlanDisplayName()}</p>
            </div>
            <Badge variant={isCancelled ? "destructive" : "default"}>
              {isCancelled ? 'Cancelled' : 'Active'}
            </Badge>
          </div>

          {/* Expiry Information */}
          {subscription.expires_at && (
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-start gap-3">
                {isCancelled ? (
                  <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                )}
                <div className="flex-1">
                  <h4 className="font-medium text-sm">
                    {isCancelled ? 'Subscription Ends' : 'Next Renewal'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(subscription.expires_at).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  {remainingTime && !isCancelled && (
                    <p className="text-sm font-medium text-green-600 mt-1">
                      {remainingTime}
                    </p>
                  )}
                  {isCancelled && (
                    <p className="text-sm text-orange-600 mt-1">
                      You'll retain access until this date, then be moved to the free plan.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Plan Features */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Your Plan Includes:</h4>
          <div className="space-y-3 mt-4">
            {[
              "Unlimited bio generation",
              "Unlimited cover letter generation",
              "All platform types available",
              "Priority support"
            ].map((text, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 shrink-0 translate-y-[1px]" />
                <p className="text-sm leading-snug text-white">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4 border-t">
          {subscription.plan_type === 'monthly' && !isCancelled && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full" disabled={isLoading}>
                  Cancel Subscription
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel Your Subscription?</AlertDialogTitle>
                  <AlertDialogDescription className="space-y-2">
                    <p>
                      Are you sure you want to cancel your monthly subscription? 
                    </p>
                    <p className="font-medium">
                      You'll retain full access until {subscription.expires_at ? 
                        new Date(subscription.expires_at).toLocaleDateString() : 'the end of your billing period'}, 
                      after which you'll be moved to the free plan.
                    </p>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleCancelSubscription}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Yes, Cancel Subscription
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {subscription.plan_type === 'daily' && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                24-hour access cannot be cancelled but will automatically expire.
              </p>
            </div>
          )}

          {subscription.plan_type === 'lifetime' && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                You have lifetime access - no expiration or cancellation needed!
              </p>
            </div>
          )}

          {isCancelled && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Your subscription has been cancelled but remains active until the end date.
              </p>
              <Button variant="default" className="w-full" onClick={handleResubscribe}>
                Resubscribe
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionManagement;
