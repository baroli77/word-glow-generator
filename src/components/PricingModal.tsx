
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, X } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolName: string;
}

const pricingPlans = [
  {
    name: "Free",
    price: "£0",
    period: "forever",
    description: "Try our tools",
    features: [
      "1 use per tool per day",
      "Basic templates",
      "Standard export options"
    ],
    limitations: ["Limited daily usage"],
    planType: "free" as const,
    disabled: true
  },
  {
    name: "24 Hour Pass",
    price: "£9",
    period: "24 hours",
    description: "Perfect for immediate needs",
    features: [
      "Unlimited tool usage",
      "All templates and tones",
      "Export to all formats",
      "24 hours of access"
    ],
    limitations: [],
    planType: "daily" as const,
    popular: true
  },
  {
    name: "Monthly",
    price: "£29",
    period: "per month",
    description: "Great for regular use",
    features: [
      "Unlimited tool usage",
      "All templates and tones",
      "Export to all formats",
      "Priority support",
      "Save unlimited documents"
    ],
    limitations: [],
    planType: "monthly" as const
  },
  {
    name: "Lifetime",
    price: "£99",
    period: "one-time",
    description: "Best value for power users",
    features: [
      "Unlimited tool usage forever",
      "All current and future features",
      "Export to all formats",
      "Priority support",
      "Save unlimited documents",
      "Early access to new tools"
    ],
    limitations: [],
    planType: "lifetime" as const
  }
];

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, toolName }) => {
  const { upgradeSubscription } = useSubscription();

  const handleUpgrade = async (planType: 'daily' | 'monthly' | 'lifetime') => {
    const success = await upgradeSubscription(planType);
    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Upgrade to Continue Using {toolName}
          </DialogTitle>
          <p className="text-center text-muted-foreground">
            You've reached your daily limit. Choose a plan to continue creating professional content.
          </p>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index} 
              className={`relative border rounded-lg p-6 ${plan.popular ? 'ring-2 ring-wordcraft-purple shadow-lg' : ''} ${plan.disabled ? 'opacity-60' : ''}`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-wordcraft-purple text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
                    POPULAR
                  </div>
                </div>
              )}
              
              <h3 className="font-semibold text-lg">{plan.name}</h3>
              <div className="mt-4 mb-6">
                <span className="text-2xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground ml-1">/{plan.period}</span>
              </div>
              <p className="text-muted-foreground text-sm mb-6">{plan.description}</p>
              
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
                {plan.limitations.map((limitation, i) => (
                  <li key={i} className="flex items-start">
                    <X className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{limitation}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                variant={plan.popular ? "default" : "outline"}
                className={`w-full ${plan.popular ? 'bg-gradient-to-r from-wordcraft-purple to-wordcraft-pink text-white hover:opacity-90' : ''}`}
                disabled={plan.disabled}
                onClick={() => plan.planType !== 'free' && handleUpgrade(plan.planType)}
              >
                {plan.disabled ? 'Current Plan' : plan.planType === 'free' ? 'Current Plan' : 'Upgrade Now'}
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PricingModal;
