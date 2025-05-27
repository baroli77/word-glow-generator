
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Copy, Download, Sparkles, Save } from 'lucide-react';
import { showToast } from "@/utils/toast";
import { saveBio } from "@/services/supabaseService";

interface BioPreviewProps {
  bio: string;
  charLimit: boolean;
  customCharCount: number;
  loading: boolean;
  onRegenerate: () => void;
  formData?: any;
}

const BioPreview: React.FC<BioPreviewProps> = ({
  bio,
  charLimit,
  customCharCount,
  loading,
  onRegenerate,
  formData
}) => {
  const [bioName, setBioName] = useState('');
  const [saving, setSaving] = useState(false);

  const handleCopy = () => {
    if (!bio) return;
    
    navigator.clipboard.writeText(bio).then(() => {
      showToast.success("Copied to clipboard!");
    }).catch(() => {
      showToast.error("Failed to copy to clipboard");
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
    
    showToast.success("Bio downloaded successfully!");
  };

  const handleSave = async () => {
    if (!bio || !bioName.trim()) {
      showToast.error("Please provide a name for your bio");
      return;
    }

    setSaving(true);
    
    try {
      const platform = formData?.platform || 'general';
      const success = await saveBio(platform, bio, {
        ...formData,
        bioName: bioName.trim()
      });
      
      if (success) {
        setBioName('');
        showToast.success("Bio saved successfully!");
      }
    } catch (error) {
      console.error('Error saving bio:', error);
      showToast.error("Failed to save bio");
    } finally {
      setSaving(false);
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
      </div>

      <div className="mt-8 bg-muted/50 border border-border rounded-lg p-4">
        <h4 className="font-medium mb-4">Save this bio</h4>
        <div className="flex items-center gap-4">
          <Input 
            placeholder="Give this bio a name (e.g. LinkedIn Professional)" 
            value={bioName}
            onChange={(e) => setBioName(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleSave} disabled={saving || !bio || !bioName.trim()}>
            {saving ? (
              <div className="flex items-center">
                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                Saving...
              </div>
            ) : (
              <div className="flex items-center">
                <Save className="w-4 h-4 mr-2" />
                Save
              </div>
            )}
          </Button>
        </div>
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
