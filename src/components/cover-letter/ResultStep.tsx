
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, Download, Sparkles } from 'lucide-react';

interface ResultStepProps {
  generatedLetter: string;
  loading: boolean;
  handleCopy: () => void;
  handleRegenerate: () => void;
  setGeneratedLetter: (value: string) => void;
  setStep: (step: number) => void;
}

const ResultStep: React.FC<ResultStepProps> = ({
  generatedLetter,
  loading,
  handleCopy,
  handleRegenerate,
  setGeneratedLetter,
  setStep
}) => {
  const hasValidContent = generatedLetter && typeof generatedLetter === 'string' && generatedLetter.trim().length > 0;

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
            <Button variant="outline" disabled={!hasValidContent}>
              <Download className="w-4 h-4 mr-2" />
              Download
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
              
              <div className="flex justify-end">
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
      
      <div className="pt-8 flex justify-between">
        <Button variant="outline" onClick={() => setStep(2)}>
          Back to Settings
        </Button>
        <Button onClick={() => setStep(1)}>
          Create Another Cover Letter
        </Button>
      </div>
    </div>
  );
};

export default ResultStep;
