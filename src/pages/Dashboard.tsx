
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, UserCircle, Star, Copy, Trash2, Plus, PieChart, Award } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { getUserBios, getUserCoverLetters } from '@/services/supabaseService';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const { user } = useAuth();
  const { subscription, getPlanDisplayName } = useSubscription();
  const [savedBios, setSavedBios] = useState([]);
  const [savedCoverLetters, setSavedCoverLetters] = useState([]);
  const [bioUsageCount, setBioUsageCount] = useState(0);
  const [coverLetterUsageCount, setCoverLetterUsageCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    // Load saved bios
    const bios = await getUserBios();
    setSavedBios(bios);

    // Load saved cover letters
    const coverLetters = await getUserCoverLetters();
    setSavedCoverLetters(coverLetters);

    // Load usage counts
    try {
      const { data: bioUsage } = await supabase
        .from('tool_usage')
        .select('*')
        .eq('user_id', user.id)
        .eq('tool_type', 'bio_generator');
      
      const { data: coverLetterUsage } = await supabase
        .from('tool_usage')
        .select('*')
        .eq('user_id', user.id)
        .eq('tool_type', 'cover_letter');

      setBioUsageCount(bioUsage?.length || 0);
      setCoverLetterUsageCount(coverLetterUsage?.length || 0);
    } catch (error) {
      console.error('Error loading usage data:', error);
    }
  };

  const getUsageLimit = (toolType: string) => {
    if (!subscription || subscription.plan_type === 'free') {
      return toolType === 'bio_generator' ? 1 : 1;
    }
    return 'Unlimited';
  };

  const getUsagePercentage = (used: number, limit: number | string) => {
    if (limit === 'Unlimited') return 0;
    return Math.min((used / (limit as number)) * 100, 100);
  };

  const formatBioForDisplay = (bio: any) => ({
    id: bio.id,
    name: bio.form_data?.bioName || `${bio.platform} Bio`,
    platform: bio.platform,
    content: bio.content,
    date: new Date(bio.created_at).toLocaleDateString(),
    favorite: false
  });

  const formatCoverLetterForDisplay = (letter: any) => ({
    id: letter.id,
    name: `${letter.job_title} Application`,
    company: letter.company_name,
    content: letter.content,
    date: new Date(letter.created_at).toLocaleDateString(),
    favorite: false
  });

  const handleCopyBio = (content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "Bio content has been copied to clipboard."
      });
    }).catch(() => {
      toast({
        title: "Failed to copy",
        description: "Could not copy bio to clipboard.",
        variant: "destructive"
      });
    });
  };

  const handleDeleteBio = async (bioId: string) => {
    try {
      const { error } = await supabase
        .from('bios')
        .delete()
        .eq('id', bioId);
      
      if (error) throw error;
      
      // Reload bios
      const bios = await getUserBios();
      setSavedBios(bios);
      
      toast({
        title: "Bio deleted",
        description: "Bio has been deleted successfully."
      });
    } catch (error) {
      toast({
        title: "Error deleting bio",
        description: "Could not delete bio.",
        variant: "destructive"
      });
    }
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
    : (user?.email?.charAt(0) || 'U').toUpperCase();

  const bioLimit = getUsageLimit('bio_generator');
  const coverLetterLimit = getUsageLimit('cover_letter');

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-12 px-4 bg-accent/20">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/4">
              <div className="wordcraft-card mb-8 text-center">
                <div className="h-24 w-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-wordcraft-purple to-wordcraft-pink flex items-center justify-center text-white text-4xl font-bold">
                  {initials}
                </div>
                <h2 className="text-xl font-semibold">{displayName}</h2>
                <p className="text-muted-foreground mb-4">{getPlanDisplayName()}</p>
                <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/pricing')}>
                  Upgrade Plan
                </Button>
              </div>
              
              <div className="wordcraft-card">
                <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase">Usage Stats</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Bios Created</span>
                      <span className="font-medium">
                        {bioUsageCount}/{bioLimit === 'Unlimited' ? '∞' : bioLimit}
                      </span>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full">
                      <div 
                        className="bg-wordcraft-purple h-2 rounded-full" 
                        style={{ width: `${bioLimit === 'Unlimited' ? 0 : getUsagePercentage(bioUsageCount, bioLimit)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Cover Letters Created</span>
                      <span className="font-medium">
                        {coverLetterUsageCount}/{coverLetterLimit === 'Unlimited' ? '∞' : coverLetterLimit}
                      </span>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full">
                      <div 
                        className="bg-wordcraft-pink h-2 rounded-full" 
                        style={{ width: `${coverLetterLimit === 'Unlimited' ? 0 : getUsagePercentage(coverLetterUsageCount, coverLetterLimit)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t">
                  <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase">Quick Actions</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/bio-generator')}>
                      <UserCircle className="w-4 h-4 mr-2" />
                      New Bio
                    </Button>
                    <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/cover-letter')}>
                      <FileText className="w-4 h-4 mr-2" />
                      New Letter
                    </Button>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t">
                  <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase">Daily Quote</h3>
                  <p className="text-sm italic">
                    "The best way to predict your future is to create it."
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">— Abraham Lincoln</p>
                </div>
              </div>
              
              <div className="wordcraft-card mt-8">
                <div className="flex items-center mb-4">
                  <Award className="h-5 w-5 text-wordcraft-purple mr-2" />
                  <h3 className="font-medium">Achievements</h3>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  {bioUsageCount > 0 && (
                    <div className="border rounded-md p-2 flex flex-col items-center justify-center text-center">
                      <PieChart className="h-6 w-6 text-wordcraft-purple mb-1" />
                      <span className="text-xs">First Bio</span>
                    </div>
                  )}
                  {coverLetterUsageCount > 0 && (
                    <div className="border rounded-md p-2 flex flex-col items-center justify-center text-center">
                      <FileText className="h-6 w-6 text-wordcraft-purple mb-1" />
                      <span className="text-xs">First Letter</span>
                    </div>
                  )}
                  <div className="border border-dashed rounded-md p-2 flex flex-col items-center justify-center text-center text-muted-foreground">
                    <Plus className="h-6 w-6 mb-1" />
                    <span className="text-xs">Keep using WordCraft!</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:w-3/4">
              <div className="wordcraft-card mb-8">
                <Tabs defaultValue="bios">
                  <TabsList className="mb-4 grid w-full grid-cols-2">
                    <TabsTrigger value="bios">My Bios</TabsTrigger>
                    <TabsTrigger value="coverLetters">My Cover Letters</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="bios" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h2 className="font-semibold">Saved Bios</h2>
                      <Button size="sm" onClick={() => navigate('/bio-generator')}>
                        <Plus className="w-4 h-4 mr-2" />
                        New Bio
                      </Button>
                    </div>
                    
                    {savedBios.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <UserCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No bios created yet</p>
                        <p className="text-sm">Create your first bio to see it here</p>
                      </div>
                    ) : (
                      savedBios.map((bio) => {
                        const displayBio = formatBioForDisplay(bio);
                        return (
                          <Card key={displayBio.id}>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 rounded-full bg-wordcraft-purple/20 flex items-center justify-center mr-4">
                                    <UserCircle className="h-6 w-6 text-wordcraft-purple" />
                                  </div>
                                  <div>
                                    <div className="flex items-center">
                                      <h3 className="font-medium">{displayBio.name}</h3>
                                      {displayBio.favorite && (
                                        <Star className="h-4 w-4 text-wordcraft-purple ml-2 fill-current" />
                                      )}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      {displayBio.platform} • Created {displayBio.date}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => handleCopyBio(displayBio.content)}
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => handleDeleteBio(displayBio.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })
                    )}
                  </TabsContent>
                  
                  <TabsContent value="coverLetters" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h2 className="font-semibold">Saved Cover Letters</h2>
                      <Button size="sm" onClick={() => navigate('/cover-letter')}>
                        <Plus className="w-4 h-4 mr-2" />
                        New Cover Letter
                      </Button>
                    </div>
                    
                    {savedCoverLetters.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No cover letters created yet</p>
                        <p className="text-sm">Create your first cover letter to see it here</p>
                      </div>
                    ) : (
                      savedCoverLetters.map((letter) => {
                        const displayLetter = formatCoverLetterForDisplay(letter);
                        return (
                          <Card key={displayLetter.id}>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 rounded-full bg-wordcraft-pink/20 flex items-center justify-center mr-4">
                                    <FileText className="h-6 w-6 text-wordcraft-pink" />
                                  </div>
                                  <div>
                                    <div className="flex items-center">
                                      <h3 className="font-medium">{displayLetter.name}</h3>
                                      {displayLetter.favorite && (
                                        <Star className="h-4 w-4 text-wordcraft-pink ml-2 fill-current" />
                                      )}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      {displayLetter.company} • Created {displayLetter.date}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="ghost" size="icon">
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })
                    )}
                  </TabsContent>
                </Tabs>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase">
                      Total Bios
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{savedBios.length}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase">
                      Total Cover Letters
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{savedCoverLetters.length}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase">
                      Total Usage
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{bioUsageCount + coverLetterUsageCount}</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
