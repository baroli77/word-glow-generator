
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import { toast } from "@/hooks/use-toast";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetReady, setResetReady] = useState(false);
  const [validating, setValidating] = useState(true);

  useEffect(() => {
    const url = new URL(window.location.href);
    const access_token = url.searchParams.get("access_token");
    const refresh_token = url.searchParams.get("refresh_token");
    const type = url.searchParams.get("type");

    console.log('Reset password params:', { 
      hasAccessToken: !!access_token, 
      hasRefreshToken: !!refresh_token, 
      type 
    });

    if (access_token && refresh_token && type === "recovery") {
      supabase.auth
        .setSession({ access_token, refresh_token })
        .then(({ error }) => {
          if (error) {
            console.error('Session setup failed:', error);
            toast({
              title: "Session setup failed",
              description: error.message,
              variant: "destructive",
            });
            setValidating(false);
          } else {
            console.log('Session set successfully for password reset');
            setResetReady(true);
            setValidating(false);
          }
        });
    } else {
      console.log('Missing or invalid parameters for password reset');
      toast({
        title: "Invalid reset link",
        description: "The password reset link is invalid or has expired.",
        variant: "destructive",
      });
      setValidating(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are the same.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        console.error('Error updating password:', error);
        toast({
          title: "Error updating password",
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.log('Password updated successfully');
        toast({
          title: "Password updated",
          description: "Your password has been successfully updated. You can now sign in with your new password.",
        });
        // Sign out to ensure clean state
        await supabase.auth.signOut();
        navigate('/login');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error updating password",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center py-12 px-4 bg-accent/20">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Validating Reset Link</CardTitle>
              <CardDescription>Please wait while we validate your password reset link...</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner />
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center py-12 px-4 bg-accent/20">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Reset Your Password</CardTitle>
            <CardDescription>
              {resetReady ? "Enter your new password below" : "There was an issue with your reset link"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {resetReady ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your new password"
                    minLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirm your new password"
                    minLength={6}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <LoadingSpinner /> : 'Update Password'}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  The password reset link is invalid, expired, or there was an error setting up your session. 
                  Please request a new password reset link.
                </p>
                <Button onClick={() => navigate('/login')} variant="outline" className="w-full">
                  Back to Login
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default ResetPassword;
