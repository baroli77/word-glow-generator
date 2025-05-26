
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock } from 'lucide-react';

const AuthGuard: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardContent className="p-8 text-center">
          <Lock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">Authentication Required</h3>
          <p className="text-muted-foreground mb-6">
            Please sign in to access the cover letter generator and start creating professional cover letters.
          </p>
          <Button onClick={() => window.location.href = '/login'}>
            Sign In to Continue
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthGuard;
