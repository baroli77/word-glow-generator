
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

interface BioEditorProps {
  bio: string;
  charLimit: boolean;
  customCharCount: number;
  onBioChange: (bio: string) => void;
}

const BioEditor: React.FC<BioEditorProps> = ({
  bio,
  charLimit,
  customCharCount,
  onBioChange
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

  const isOverLimit = charLimit && customCharCount > 0 && bio.length > customCharCount;

  return (
    <div>
      <Textarea
        value={bio}
        onChange={(e) => onBioChange(e.target.value)}
        rows={8}
        className="mb-4"
        placeholder="Your bio will appear here..."
        aria-label="Edit bio content"
      />
      
      {charLimit && (
        <div className="mb-4 flex items-center justify-between">
          <div className={`text-sm ${isOverLimit ? 'text-red-500' : 'text-muted-foreground'}`}>
            Character count: {bio.length}
            {customCharCount > 0 && ` / ${customCharCount}`}
          </div>
          {isOverLimit && (
            <div className="text-sm text-red-500 font-medium">
              Exceeds character limit by {bio.length - customCharCount} characters
            </div>
          )}
        </div>
      )}
      
      <div className="flex justify-end">
        <Button onClick={handleCopy} disabled={!bio}>
          <Copy className="w-4 h-4 mr-2" />
          Copy to Clipboard
        </Button>
      </div>
    </div>
  );
};

export default BioEditor;
