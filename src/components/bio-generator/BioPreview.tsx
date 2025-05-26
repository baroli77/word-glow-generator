
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, Download, Share2, Sparkles } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

interface BioPreviewProps {
  bio: string;
  charLimit: boolean;
  customCharCount: number;
  loading: boolean;
  onRegenerate: () => void;
}

const BioPreview: React.FC<BioPreviewProps> = ({
  bio,
  charLimit,
  customCharCount,
  loading,
  onRegenerate
}) => {
  const handleCopy = () => {
    if (!bio) return;
    
    navigator.clipboard.writeText(bio).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "Your bio has been copied to clipboard."
      });
    }).catch(() => {
      toast({
        title: "Failed to copy",
        description: "Could not copy bio to clipboard.",
        variant: "destructive"
      });
    });
  };

  const handleDownload = () => {
    if (!bio) return;
    
    const blob = new Blob([bio], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bio.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (!bio) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Bio',
          text: bio,
        });
      } catch (error) {
        // User cancelled or sharing failed
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  const isOverLimit = charLimit && customCharCount > 0 && bio.length > customCharCount;

  return (
    <div className="animate-fade-in">
      <h3 className="text-lg font-medium mb-4">Your generated bio</h3>
      
      <Card className="border border-border bg-card">
        <CardContent className="p-6">
          <p className="whitespace-pre-line text-card-foreground" aria-label="Generated bio content">
            {bio}
          </p>
          {charLimit && (
            <div className={`mt-4 text-sm ${isOverLimit ? 'text-red-500' : 'text-muted-foreground'}`}>
              Character count: {bio.length}
              {customCharCount > 0 && ` / ${customCharCount}`}
              {isOverLimit && (
                <div className="text-red-500 font-medium">
                  Exceeds limit by {bio.length - customCharCount} characters
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="mt-6 flex flex-wrap gap-4">
        <Button onClick={handleCopy} disabled={!bio}>
          <Copy className="w-4 h-4 mr-2" />
          Copy to Clipboard
        </Button>
        <Button variant="outline" onClick={handleDownload} disabled={!bio}>
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
        <Button variant="outline" onClick={handleShare} disabled={!bio}>
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-muted-foreground mb-4">Not happy with your bio?</p>
        <Button 
          variant="outline" 
          onClick={onRegenerate}
          disabled={loading || !bio}
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
    </div>
  );
};

export default BioPreview;
