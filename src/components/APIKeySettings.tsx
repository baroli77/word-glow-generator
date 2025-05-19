
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

interface APIKeySettingsProps {
  onApiKeyChange: (key: string) => void;
}

const APIKeySettings: React.FC<APIKeySettingsProps> = ({ onApiKeyChange }) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  
  // Try to load API key from localStorage on component mount
  useEffect(() => {
    const savedKey = localStorage.getItem('openai_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      onApiKeyChange(savedKey);
    }
  }, [onApiKeyChange]);
  
  const handleSaveKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('openai_api_key', apiKey);
      onApiKeyChange(apiKey);
      toast({
        title: "API Key Saved",
        description: "Your OpenAI API key has been saved.",
      });
      setShowSettings(false);
    } else {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="mb-6 border rounded-md p-4">
      {!showSettings ? (
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium">OpenAI API Key</h3>
            <p className="text-xs text-muted-foreground">
              {apiKey ? "API key is set" : "No API key set - AI features disabled"}
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowSettings(true)}
          >
            <Lock className="w-4 h-4 mr-2" />
            {apiKey ? "Change API Key" : "Add API Key"}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <Label htmlFor="apiKey">Your OpenAI API Key</Label>
            <Input 
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Your API key is stored locally and never sent to our servers.
            </p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowSettings(false)}
            >
              Cancel
            </Button>
            <Button 
              size="sm"
              onClick={handleSaveKey}
            >
              Save Key
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default APIKeySettings;
