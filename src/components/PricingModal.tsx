
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Clock, Star, Crown, Sparkles, Calendar } from 'lucide-react';
import { PRICING_CONFIG, type PlanType } from '@/config/pricing';
import PlanCard from '@/components/shared/PlanCard';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolName: string;
  onUpgradeComplete?: () => void;
}

const MODAL_PLANS: PlanType[] = ['daily', 'weekly', 'monthly', 'lifetime'];

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, toolName, onUpgradeComplete }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Upgrade to Continue Using {toolName}
          </DialogTitle>
          <p className="text-center text-muted-foreground">
            You've reached your free limit. Choose a plan to continue creating professional content.
          </p>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {MODAL_PLANS.map((planType, index) => (
            <PlanCard
              key={planType}
              planType={planType}
              currentPlan="free"
              showCurrentBadge={false}
            />
          ))}
        </div>
        
        <div className="mt-6 text-center bg-muted rounded-lg p-4">
          <p className="text-sm text-muted-foreground">
            All plans include instant access, no setup fees, and can be used immediately after purchase.
            Plans automatically expire at the end of their period.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PricingModal;
