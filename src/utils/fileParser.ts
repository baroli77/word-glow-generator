
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ParsedFile {
  content: string;
  error?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

export async function parseFile(file: File): Promise<ParsedFile> {
  // Check file size first
  if (file.size > MAX_FILE_SIZE) {
    const errorMessage = `File size exceeds 5MB limit. Current size: ${(file.size / (1024 * 1024)).toFixed(1)}MB`;
    toast({
      title: "File too large",
      description: errorMessage,
      variant: "destructive",
    });
    return { content: '', error: errorMessage };
  }

  try {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (!['txt', 'pdf', 'docx', 'doc'].includes(fileExtension || '')) {
      const errorMessage = 'Unsupported file format';
      toast({
        title: "Unsupported file format",
        description: "Please upload a PDF, DOCX, DOC, or TXT file.",
        variant: "destructive",
      });
      return { content: '', error: errorMessage };
    }

    // Convert file to base64
    const base64Data = await fileToBase64(file);
    
    console.log('Sending file to parse-cv Edge Function...');
    
    // Get the current user's session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      const errorMessage = 'Authentication required';
      toast({
        title: "Authentication required",
        description: "Please sign in to parse CV files.",
        variant: "destructive",
      });
      return { content: '', error: errorMessage };
    }

    // Call the Supabase Edge Function
    const response = await fetch(`https://qwlotordnpeaahjtqyel.supabase.co/functions/v1/parse-cv`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        fileData: base64Data,
        fileName: file.name,
        fileType: file.type
      })
    });

    console.log('Parse CV Edge Function response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Parse CV Edge Function error:', errorData);
      const errorMessage = errorData.error || "Failed to parse CV file";
      
      toast({
        title: "CV Parsing Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return { content: '', error: errorMessage };
    }

    const data = await response.json();
    console.log('Successfully parsed CV, content length:', data.content?.length || 0);
    
    if (!data.content || typeof data.content !== 'string' || data.content.trim().length === 0) {
      const errorMessage = "No readable text found in the file";
      toast({
        title: "CV Parsing Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return { content: '', error: errorMessage };
    }

    return { content: data.content.trim() };

  } catch (error) {
    console.error('File parsing error:', error);
    const errorMessage = `Failed to parse file: ${(error as Error).message}`;
    toast({
      title: "File parsing error",
      description: "There was an issue parsing your file. Please try a different file or format.",
      variant: "destructive",
    });
    return { content: '', error: errorMessage };
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
      const base64Data = result.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = (error) => reject(error);
  });
}
