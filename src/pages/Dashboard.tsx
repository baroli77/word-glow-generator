import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { FileText, UserCircle, Star, Copy, Trash2, Plus, Edit, Settings, Printer, Download } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { getUserBios, getUserCoverLetters } from '@/services/supabaseService';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast";
import { getDailyQuote } from '@/utils/dailyQuotes';

const Dashboard = () => {
  const { user } = useAuth();
  const { subscription, getPlanDisplayName } = useSubscription();
  const [savedBios, setSavedBios] = useState([]);
  const [savedCoverLetters, setSavedCoverLetters] = useState([]);
  const [bioUsageCount, setBioUsageCount] = useState(0);
  const [coverLetterUsageCount, setCoverLetterUsageCount] = useState(0);
  const [selectedBio, setSelectedBio] = useState(null);
  const [selectedCoverLetter, setSelectedCoverLetter] = useState(null);
  const [isViewBioOpen, setIsViewBioOpen] = useState(false);
  const [isViewCoverLetterOpen, setIsViewCoverLetterOpen] = useState(false);
  const [editedCoverLetterContent, setEditedCoverLetterContent] = useState('');
  const [isEditingCoverLetter, setIsEditingCoverLetter] = useState(false);
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
    jobTitle: letter.job_title,
    content: letter.content,
    date: new Date(letter.created_at).toLocaleDateString(),
    favorite: false
  });

  const handleViewBio = (bio: any) => {
    setSelectedBio(bio);
    setIsViewBioOpen(true);
  };

  const handleViewCoverLetter = (letter: any) => {
    setSelectedCoverLetter(letter);
    setEditedCoverLetterContent(letter.content);
    setIsEditingCoverLetter(false);
    setIsViewCoverLetterOpen(true);
  };

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

  const handleCopyCoverLetter = (content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "Cover letter content has been copied to clipboard."
      });
    }).catch(() => {
      toast({
        title: "Failed to copy",
        description: "Could not copy cover letter to clipboard.",
        variant: "destructive"
      });
    });
  };

  const handleDownloadCoverLetter = async (content: string, companyName: string) => {
    try {
      // Create a temporary div for PDF generation
      const element = document.createElement('div');
      element.innerHTML = `
        <div style="
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 20px;
        ">
          <div style="white-space: pre-wrap; font-size: 12pt;">
            ${content.replace(/\n/g, '<br>')}
          </div>
        </div>
      `;

      const opt = {
        margin: 1,
        filename: `cover-letter-${companyName || 'company'}-${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      // Generate and download PDF
      const html2pdf = (await import('html2pdf.js')).default;
      await html2pdf().set(opt).from(element).save();
      
      toast({
        title: "PDF Downloaded",
        description: "Your cover letter has been downloaded as a PDF.",
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      // Fallback to text download
      try {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cover-letter-${companyName || 'company'}-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast({
          title: "Downloaded as Text",
          description: "PDF generation failed, downloaded as text file instead.",
        });
      } catch (fallbackError) {
        toast({
          title: "Download Failed",
          description: "Could not download the cover letter. Please try copying the text instead.",
          variant: "destructive",
        });
      }
    }
  };

  const handlePrintCoverLetter = (content: string) => {
    try {
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Could not open print window');
      }

      // Generate HTML content for printing
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Cover Letter</title>
            <style>
              @media print {
                body {
                  font-family: 'Times New Roman', serif;
                  line-height: 1.6;
                  max-width: 8.5in;
                  margin: 0;
                  padding: 1in;
                  color: #000;
                  font-size: 12pt;
                }
                .cover-letter {
                  white-space: pre-wrap;
                }
                @page {
                  margin: 1in;
                }
              }
              body {
                font-family: 'Times New Roman', serif;
                line-height: 1.6;
                max-width: 8.5in;
                margin: 0 auto;
                padding: 1in;
                color: #000;
                font-size: 12pt;
              }
              .cover-letter {
                white-space: pre-wrap;
              }
            </style>
          </head>
          <body>
            <div class="cover-letter">${content.replace(/\n/g, '<br>')}</div>
          </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Wait for content to load, then trigger print
      printWindow.onload = () => {
        printWindow.print();
        printWindow.onafterprint = () => {
          printWindow.close();
        };
      };
      
      toast({
        title: "Print Dialog Opened",
        description: "Your cover letter is ready to print.",
      });
    } catch (error) {
      console.error('Print error:', error);
      toast({
        title: "Print Failed",
        description: "Could not open print dialog. Please try copying the text and printing manually.",
        variant: "destructive",
      });
    }
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

  const handleDeleteCoverLetter = async (letterId: string) => {
    try {
      const { error } = await supabase
        .from('cover_letters')
        .delete()
        .eq('id', letterId);
      
      if (error) throw error;
      
      // Reload cover letters
      const coverLetters = await getUserCoverLetters();
      setSavedCoverLetters(coverLetters);
      
      toast({
        title: "Cover letter deleted",
        description: "Cover letter has been deleted successfully."
      });
    } catch (error) {
      toast({
        title: "Error deleting cover letter",
        description: "Could not delete cover letter.",
        variant: "destructive"
      });
    }
  };

  const handleSaveCoverLetterEdits = async () => {
    if (!selectedCoverLetter) return;

    try {
      const { error } = await supabase
        .from('cover_letters')
        .update({ 
          content: editedCoverLetterContent,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedCoverLetter.id);
      
      if (error) throw error;
      
      // Update the local state
      const updatedCoverLetter = { ...selectedCoverLetter, content: editedCoverLetterContent };
      setSelectedCoverLetter(updatedCoverLetter);
      
      // Reload cover letters
      const coverLetters = await getUserCoverLetters();
      setSavedCoverLetters(coverLetters);
      
      setIsEditingCoverLetter(false);
      
      toast({
        title: "Cover letter updated",
        description: "Your changes have been saved successfully."
      });
    } catch (error) {
      toast({
        title: "Error saving changes",
        description: "Could not save your changes.",
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
  const dailyQuote = getDailyQuote();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-12 px-4 bg-accent/20">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/4">
              <div className="brand-card mb-8 text-center">
                <div className="h-24 w-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-brand-purple to-brand-pink flex items-center justify-center text-white text-4xl font-bold">
                  {initials}
                </div>
                <h2 className="text-xl font-semibold">{displayName}</h2>
                <p className="text-muted-foreground mb-4">{getPlanDisplayName()}</p>
                <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/pricing')}>
                  Upgrade Plan
                </Button>
              </div>
              
              <div className="brand-card">
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
                        className="bg-brand-purple h-2 rounded-full" 
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
                        className="bg-brand-pink h-2 rounded-full" 
                        style={{ width: `${coverLetterLimit === 'Unlimited' ? 0 : getUsagePercentage(coverLetterUsageCount, coverLetterLimit)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t">
                  <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase">Quick Actions</h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full h-auto py-3 px-2 text-xs flex flex-col items-center gap-1" 
                      onClick={() => navigate('/bio-generator')}
                    >
                      <UserCircle className="w-4 h-4 flex-shrink-0" />
                      <span className="whitespace-nowrap">New Bio</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full h-auto py-3 px-2 text-xs flex flex-col items-center gap-1" 
                      onClick={() => navigate('/cover-letter')}
                    >
                      <FileText className="w-4 h-4 flex-shrink-0" />
                      <span className="whitespace-nowrap">New Letter</span>
                    </Button>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t">
                  <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase">Daily Quote</h3>
                  <p className="text-sm italic">
                    "{dailyQuote.text}"
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">— {dailyQuote.author}</p>
                </div>
              </div>
            </div>
            
            <div className="lg:w-3/4">
              <div className="brand-card mb-8">
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
                          <Card key={displayBio.id} className="cursor-pointer hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div 
                                  className="flex items-center flex-1 cursor-pointer"
                                  onClick={() => handleViewBio(displayBio)}
                                >
                                  <div className="h-10 w-10 rounded-full bg-brand-purple/20 flex items-center justify-center mr-4">
                                    <UserCircle className="h-6 w-6 text-brand-purple" />
                                  </div>
                                  <div>
                                    <div className="flex items-center">
                                      <h3 className="font-medium">{displayBio.name}</h3>
                                      {displayBio.favorite && (
                                        <Star className="h-4 w-4 text-brand-purple ml-2 fill-current" />
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
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCopyBio(displayBio.content);
                                    }}
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteBio(displayBio.id);
                                    }}
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
                          <Card key={displayLetter.id} className="cursor-pointer hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div 
                                  className="flex items-center flex-1 cursor-pointer"
                                  onClick={() => handleViewCoverLetter(displayLetter)}
                                >
                                  <div className="h-10 w-10 rounded-full bg-brand-pink/20 flex items-center justify-center mr-4">
                                    <FileText className="h-6 w-6 text-brand-pink" />
                                  </div>
                                  <div>
                                    <div className="flex items-center">
                                      <h3 className="font-medium">{displayLetter.name}</h3>
                                      {displayLetter.favorite && (
                                        <Star className="h-4 w-4 text-brand-pink ml-2 fill-current" />
                                      )}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      {displayLetter.company} • Created {displayLetter.date}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCopyCoverLetter(displayLetter.content);
                                    }}
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handlePrintCoverLetter(displayLetter.content);
                                    }}
                                  >
                                    <Printer className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDownloadCoverLetter(displayLetter.content, displayLetter.company);
                                    }}
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteCoverLetter(displayLetter.id);
                                    }}
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

      {/* Bio View Dialog */}
      <Dialog open={isViewBioOpen} onOpenChange={setIsViewBioOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCircle className="h-5 w-5 text-brand-purple" />
              {selectedBio?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Platform:</span> {selectedBio?.platform} • 
              <span className="font-medium ml-2">Created:</span> {selectedBio?.date}
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {selectedBio?.content}
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => handleCopyBio(selectedBio?.content || '')}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Bio
              </Button>
              <Button onClick={() => setIsViewBioOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cover Letter View Dialog */}
      <Dialog open={isViewCoverLetterOpen} onOpenChange={setIsViewCoverLetterOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-brand-pink" />
              {selectedCoverLetter?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Company:</span> {selectedCoverLetter?.company} • 
              <span className="font-medium ml-2">Position:</span> {selectedCoverLetter?.jobTitle} • 
              <span className="font-medium ml-2">Created:</span> {selectedCoverLetter?.date}
            </div>
            
            {isEditingCoverLetter ? (
              <div className="space-y-4">
                <Textarea
                  value={editedCoverLetterContent}
                  onChange={(e) => setEditedCoverLetterContent(e.target.value)}
                  rows={15}
                  className="w-full"
                />
                <div className="flex justify-between gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsEditingCoverLetter(false);
                      setEditedCoverLetterContent(selectedCoverLetter?.content || '');
                    }}
                  >
                    Cancel
                  </Button>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => handleCopyCoverLetter(editedCoverLetterContent)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button onClick={handleSaveCoverLetterEdits}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {selectedCoverLetter?.content}
                  </p>
                </div>
                <div className="flex justify-between gap-2">
                  <Button onClick={() => setIsViewCoverLetterOpen(false)}>
                    Close
                  </Button>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => handleCopyCoverLetter(selectedCoverLetter?.content || '')}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditingCoverLetter(true)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
