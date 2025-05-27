
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface EmailVerificationProps {
  email: string;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({ email }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center py-12 px-4 bg-accent/20">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-wordcraft-purple/10 flex items-center justify-center">
              <Mail className="w-6 h-6 text-wordcraft-purple" />
            </div>
            <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
            <CardDescription>
              We've sent a verification link to your email address
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                We've sent a verification email to:
              </p>
              <p className="font-medium text-wordcraft-purple">
                {email}
              </p>
              <p className="text-sm text-muted-foreground">
                Click the link in the email to verify your account and complete your registration.
              </p>
            </div>
            
            <div className="pt-4 space-y-3">
              <p className="text-xs text-muted-foreground text-center">
                Didn't receive the email? Check your spam folder or try signing up again.
              </p>
              
              <div className="flex justify-center">
                <Link to="/signup">
                  <Button variant="outline" size="sm">
                    Back to Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default EmailVerification;
