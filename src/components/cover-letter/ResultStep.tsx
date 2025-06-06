
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, Download, Sparkles, Save, Printer } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { saveCoverLetter } from '@/services/supabaseService';
import { useAuth } from '@/context/AuthContext';
import html2pdf from 'html2pdf.js';

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

  const convertToSemanticHTML = (content: string) => {
    // Clean the content first
    const cleanContent = content.trim().replace(/\s+/g, ' ');
    
    // Split into lines and filter out empty ones
    const lines = cleanContent.split('\n').filter(line => line.trim().length > 0);
    
    let semanticHTML = '';
    let isContactInfo = true;
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // Skip empty lines
      if (!trimmedLine) return;
      
      // First few lines are usually contact info
      if (isContactInfo && (
        trimmedLine.includes('@') || 
        trimmedLine.includes('Phone:') ||
        trimmedLine.includes('Email:') ||
        trimmedLine.includes('Address:') ||
        /^\d/.test(trimmedLine) ||
        index < 3
      )) {
        semanticHTML += `<address>${trimmedLine}</address>\n`;
      } else {
        isContactInfo = false;
        semanticHTML += `<p>${trimmedLine}</p>\n`;
      }
    });
    
    return semanticHTML;
  };

  const handlePrint = () => {
    if (!hasValidContent) return;
    
    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Could not open print window');
      }

      const semanticContent = convertToSemanticHTML(generatedLetter);

      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Cover Letter</title>
            <style>
              #cover-letter {
                font-family: Arial, sans-serif;
                font-size: 12pt;
                line-height: 1.6;
                margin: 40px auto;
                padding: 20px;
                width: 600px;
                max-width: 100%;
                color: #000;
                background: #fff;
                white-space: normal;
              }

              #cover-letter p {
                margin-bottom: 12px;
              }

              #cover-letter address {
                margin-bottom: 20px;
                font-style: normal;
              }

              body {
                background: #fff;
                margin: 0;
                padding: 0;
              }

              @media print {
                body {
                  margin: 0;
                  padding: 0;
                }
                #cover-letter {
                  margin: 0;
                  padding: 1in;
                  width: auto;
                  max-width: none;
                }
                @page {
                  margin: 1in;
                }
              }
            </style>
          </head>
          <body>
            <div id="cover-letter">${semanticContent}</div>
          </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
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

  const handleDownload = async () => {
    if (!hasValidContent) return;
    
    try {
      // Create semantic HTML structure
      const semanticContent = convertToSemanticHTML(generatedLetter);
      
      // Create a temporary container
      const tempContainer = document.createElement('div');
      tempContainer.innerHTML = `
        <style>
          #cover-letter {
            font-family: Arial, sans-serif;
            font-size: 12pt;
            line-height: 1.6;
            margin: 40px auto;
            padding: 20px;
            width: 600px;
            max-width: 100%;
            color: #000;
            background: #fff;
            white-space: normal;
          }

          #cover-letter p {
            margin-bottom: 12px;
          }

          #cover-letter address {
            margin-bottom: 20px;
            font-style: normal;
          }

          body {
            background: #fff;
            margin: 0;
            padding: 0;
          }
        </style>
        <div id="cover-letter">${semanticContent}</div>
      `;
      
      // Add to document temporarily
      document.body.appendChild(tempContainer);

      const opt = {
        margin: 0,
        filename: `cover-letter-${formData?.companyName || 'company'}-${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' }
      };

      // Generate and download PDF
      await html2pdf().set(opt).from(tempContainer.querySelector('#cover-letter')).save();
      
      // Clean up
      document.body.removeChild(tempContainer);
      
      toast({
        title: "PDF Downloaded",
        description: "Your cover letter has been downloaded as a PDF.",
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      // Fallback to text download
      try {
        const blob = new Blob([generatedLetter], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cover-letter-${formData?.companyName || 'company'}-${new Date().toISOString().split('T')[0]}.txt`;
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
