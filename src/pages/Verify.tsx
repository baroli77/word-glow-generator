
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingSpinner from '@/components/LoadingSpinner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { toast } from "@/hooks/use-toast";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");
      const type = searchParams.get("type");

      console.log('Verification attempt:', { token: !!token, type });

      if (!token || !type) {
        console.error('Missing token or type in URL');
        setVerificationStatus('error');
        setVerifying(false);
        toast({
          title: "Invalid verification link",
          description: "The verification link is missing required parameters.",
          variant: "destructive",
        });
        return;
      }

      try {
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: type as any
        });

        if (error) {
          console.error('Verification failed:', error);
          setVerificationStatus('error');
          toast({
            title: "Verification failed",
            description: error.message || "Unable to verify your email. The link may have expired.",
            variant: "destructive",
          });
        } else {
          console.log('Email verified successfully:', data);
          setVerificationStatus('success');
          toast({
            title: "Email verified!",
            description: "Your email has been successfully verified. Redirecting to dashboard...",
          });
          
          // Redirect to dashboard after successful verification
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        }
      } catch (error) {
        console.error('Verification error:', error);
        setVerificationStatus('error');
        toast({
          title: "Verification error",
          description: "An unexpected error occurred during verification.",
          variant: "destructive",
        });
      } finally {
        setVerifying(false);
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  const getStatusContent = () => {
    switch (verificationStatus) {
      case 'verifying':
        return {
          title: "Verifying your email...",
          description: "Please wait while we verify your email address.",
          content: (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner />
            </div>
          )
        };
      case 'success':
        return {
          title: "Email verified successfully!",
          description: "Your email has been verified. You will be redirected to your dashboard shortly.",
          content: (
            <div className="text-center py-8">
              <div className="text-green-600 text-6xl mb-4">✓</div>
              <p className="text-green-600 font-medium">Verification complete</p>
            </div>
          )
        };
      case 'error':
        return {
          title: "Verification failed",
          description: "We couldn't verify your email. The link may have expired or already been used.",
          content: (
            <div className="text-center py-8">
              <div className="text-red-600 text-6xl mb-4">✗</div>
              <p className="text-red-600 font-medium mb-4">Verification failed</p>
              <button
                onClick={() => navigate('/login')}
                className="text-wordcraft-purple hover:underline"
              >
                Return to login
              </button>
            </div>
          )
        };
      default:
        return {
          title: "Verifying...",
          description: "Processing verification...",
          content: <LoadingSpinner />
        };
    }
  };

  const statusContent = getStatusContent();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center py-12 px-4 bg-accent/20">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              {statusContent.title}
            </CardTitle>
            <CardDescription>
              {statusContent.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {statusContent.content}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Verify;
