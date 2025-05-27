
import React from 'react';
import { Button } from "@/components/ui/button";
import { Lock, Star, Clock, Infinity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PremiumGuardProps {
  onUpgrade: () => void;
}

const PremiumGuard: React.FC<PremiumGuardProps> = ({ onUpgrade }) => {
  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <div className="mb-8">
        <Lock className="w-20 h-20 mx-auto mb-6 text-makemybio-purple" />
        <h2 className="text-3xl font-bold mb-4">Premium Feature</h2>
        <p className="text-muted-foreground text-lg mb-6">
          The Cover Letter Generator is available to premium users only. 
          Upgrade to create professional, AI-powered cover letters.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="border-2">
          <CardHeader className="text-center pb-2">
            <Clock className="w-8 h-8 mx-auto mb-2 text-makemybio-purple" />
            <CardTitle className="text-lg">24-Hour Access</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-2xl font-bold mb-2">£9</div>
            <p className="text-sm text-muted-foreground">Perfect for immediate needs</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-makemybio-purple">
          <CardHeader className="text-center pb-2">
            <Star className="w-8 h-8 mx-auto mb-2 text-makemybio-purple" />
            <CardTitle className="text-lg">Monthly Plan</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-2xl font-bold mb-2">£29</div>
            <p className="text-sm text-muted-foreground">Great for regular use</p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="text-center pb-2">
            <Infinity className="w-8 h-8 mx-auto mb-2 text-makemybio-purple" />
            <CardTitle className="text-lg">Lifetime Access</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-2xl font-bold mb-2">£99</div>
            <p className="text-sm text-muted-foreground">Best value forever</p>
          </CardContent>
        </Card>
      </div>

      <Button 
        onClick={onUpgrade}
        size="lg"
        className="bg-gradient-to-r from-makemybio-purple to-makemybio-pink text-white hover:opacity-90"
      >
        Upgrade to Premium
      </Button>
      
      <div className="mt-6 text-sm text-muted-foreground">
        ✓ Unlimited cover letter generation<br />
        ✓ All bio platforms including LinkedIn<br />
        ✓ Premium templates and tones
      </div>
    </div>
  );
};

export default PremiumGuard;
