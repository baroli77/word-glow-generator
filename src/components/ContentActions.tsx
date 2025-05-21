
import React from 'react';
import { Check, Copy, Save } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from '@/components/ui/sonner';
import { useState } from 'react';

interface ContentActionsProps {
  content: string;
  filename?: string;
}

const ContentActions = ({ content, filename = 'content' }: ContentActionsProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Content saved');
  };

  return (
    <div className="flex space-x-2 mt-4">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
        onClick={handleCopy}
        disabled={!content}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        {copied ? 'Copied' : 'Copy'}
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
        onClick={handleSave}
        disabled={!content}
      >
        <Save className="h-4 w-4" />
        Save
      </Button>
    </div>
  );
};

export default ContentActions;
