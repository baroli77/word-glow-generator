
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Check } from 'lucide-react';

const APIKeySettings: React.FC = () => {
  return (
    <div className="mb-6 border rounded-md p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">OpenAI API Key</h3>
          <p className="text-xs text-muted-foreground">
            API key is configured on the server
          </p>
        </div>
        <div className="bg-green-100 text-green-800 rounded-full px-2 py-1 text-xs flex items-center">
          <Check className="w-3 h-3 mr-1" />
          Configured
        </div>
      </div>
    </div>
  );
};

export default APIKeySettings;
