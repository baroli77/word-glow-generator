
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, Download, Sparkles, Save, Printer } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { saveCoverLetter } from '@/services/supabaseService';
import { useAuth } from '@/context/AuthContext';

interface ResultStepProps {
  generatedLetter: string;
  loading: boolean;
  handleCopy: () => void;
  handleRegenerate: () => void;
  setGeneratedLetter: (value: string) => void;
  setStep: (step: number) => void;
  formData?: {
    jobTitle: string;
    companyName: string;
    additionalInfo?: string;
    tone: string;
  };
}

const ResultStep: React.FC<ResultStepProps> = ({
  generatedLetter,
  loading,
  handleCopy,
  handleRegenerate,
  setGeneratedLetter,
  setStep,
  formData
}) => {
  const { user } = useAuth();
  const hasValidContent = generatedLetter && typeof generatedLetter === 'string' && generatedLetter.trim().length > 0;

  const handleSave = async () => {
    if (!hasValidContent || !formData || !user) {
      toast({
        title: "Cannot Save",
        description: "Please ensure you're logged in and have a valid cover letter to save.",
        variant: "destructive",
      });
      return;
    }

    const success = await saveCoverLetter(
      formData.jobTitle,
      formData.companyName,
      generatedLetter,
      formData
    );

    if (success) {
      toast({
        title: "Cover Letter Saved",
        description: "Your cover letter has been saved to your dashboard.",
      });
    }
  };

  const handlePrint = () => {
    if (!hasValidContent) return;
    
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
            <div class="cover-letter">${generatedLetter.replace(/\n/g, '<br>')}</div>
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

  const handleDownload = () => {
    if (!hasValidContent) return;
    
    try {
      // Create a new window for PDF generation
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Could not open print window');
      }

      // Generate HTML content for PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Cover Letter</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                max-width: 800px;
                margin: 0 auto;
                padding: 40px 20px;
                color: #333;
              }
              .cover-letter {
                white-space: pre-wrap;
                font-size: 12pt;
              }
              @media print {
                body { margin: 0; padding: 20px; }
              }
            </style>
          </head>
          <body>
            <div class="cover-letter">${generatedLetter.replace(/\n/g, '<br>')}</div>
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
        title: "PDF Download Ready",
        description: "Your cover letter is ready to download as PDF. Please use the print dialog to save as PDF.",
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      // Fallback to text download
      try {
        const blob = new Blob([generatedLetter], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cover-letter-${new Date().toISOString().split('T')[0]}.txt`;
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

  const handleSaveEdits = () => {
    toast({
      title: "Changes Saved",
      description: "Your edits have been saved to the cover letter.",
    });
  };

  return (
    <div className="animate-fade-in">
      <h3 className="text-lg font-medium mb-4">Your Generated Cover Letter</h3>
      
      <Tabs defaultValue="preview">
        <TabsList className="mb-4">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="edit">Edit</TabsTrigger>
        </TabsList>
        
        <TabsContent value="preview">
          <Card>
            <CardContent className="p-6 bg-card rounded-md shadow-sm">
              {hasValidContent ? (
                <div className="whitespace-pre-wrap font-sans text-card-foreground">{generatedLetter}</div>
              ) : (
                <div className="text-muted-foreground text-center py-8">
                  No content available. Please try generating again.
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="mt-6 flex flex-wrap gap-4">
            <Button onClick={handleCopy} disabled={!hasValidContent}>
              <Copy className="w-4 h-4 mr-2" />
              Copy to Clipboard
            </Button>
            <Button variant="outline" onClick={handlePrint} disabled={!hasValidContent}>
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" onClick={handleDownload} disabled={!hasValidContent}>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button variant="outline" onClick={handleSave} disabled={!hasValidContent || !user}>
              <Save className="w-4 h-4 mr-2" />
              Save to Dashboard
            </Button>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-muted-foreground mb-4">Not satisfied with your cover letter?</p>
            <Button 
              variant="outline" 
              onClick={handleRegenerate}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                  Regenerating...
                </div>
              ) : (
                <div className="flex items-center">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Regenerate
                </div>
              )}
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="edit">
          {hasValidContent ? (
            <>
              <Textarea
                value={generatedLetter}
                onChange={(e) => setGeneratedLetter(e.target.value)}
                rows={12}
                className="mb-4"
              />
              
              <div className="flex justify-between gap-4">
                <Button variant="outline" onClick={handleSaveEdits}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                <Button onClick={handleCopy}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy to Clipboard
                </Button>
              </div>
            </>
          ) : (
            <div className="text-muted-foreground text-center py-8">
              No content available to edit. Please try generating again.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResultStep;
