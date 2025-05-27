
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface OpenAIResponse {
  content: string;
  error?: string;
}

export async function generateWithAI(prompt: string, retryCount = 0): Promise<OpenAIResponse> {
  const maxRetries = 2;
  
  try {
    // Get the current user's session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to use this feature.",
        variant: "destructive",
      });
      return { content: "", error: "Authentication required" };
    }

    console.log('Calling generate-content Edge Function...');

    // Call the Supabase Edge Function
    const response = await fetch(`https://qwlotordnpeaahjtqyel.supabase.co/functions/v1/generate-content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({ prompt })
    });

    console.log('Edge Function response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Edge Function error:', errorData);
      const errorMessage = errorData.error || "Failed to generate content";
      
      // Handle rate limiting specifically
      if (response.status === 429 && retryCount < maxRetries) {
        toast({
          title: "Rate limited",
          description: "Waiting and trying again...",
          variant: "default",
        });
        
        // Exponential backoff
        const waitTime = Math.pow(2, retryCount) * 1000;
        await new Promise(resolve => setTimeout(resolve, waitTime));
        
        return generateWithAI(prompt, retryCount + 1);
      }

      // If Edge Function is not deployed or having issues, provide a fallback for testing
      if (response.status === 404 || response.status === 500) {
        console.warn('Edge Function not available, using fallback response');
        toast({
          title: "Using Test Mode",
          description: "The AI service is temporarily unavailable. Using a test response.",
          variant: "default",
        });
        
        // Return a placeholder response for testing
        return {
          content: `Dear Hiring Manager,

I am writing to express my strong interest in the position you mentioned. Based on my background and experience outlined in my CV, I believe I would be an excellent fit for this role.

My qualifications and experience align well with what you're looking for, and I am excited about the opportunity to contribute to your team. I am confident that my skills and passion make me a strong candidate.

Thank you for considering my application. I look forward to hearing from you soon.

Best regards,
[Your Name]

--- 
Note: This is a test response. The AI service will be restored shortly.`
        };
      }
      
      toast({
        title: "API Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      return { content: "", error: errorMessage };
    }

    const data = await response.json();
    console.log('Successfully received response from Edge Function');
    return { content: data.content };

  } catch (error) {
    console.error('generateWithAI error:', error);
    
    // If network error and retries available, retry
    if (retryCount < maxRetries && error instanceof Error && error.message.includes('network')) {
      toast({
        title: "Network issue",
        description: "Retrying connection...",
        variant: "default",
      });
      
      const waitTime = Math.pow(2, retryCount) * 1000;
      await new Promise(resolve => setTimeout(resolve, waitTime));
      
      return generateWithAI(prompt, retryCount + 1);
    }

    // Fallback for any other errors during development/testing
    console.warn('Using fallback response due to error:', error);
    toast({
      title: "Using Test Mode", 
      description: "The AI service encountered an issue. Using a test response.",
      variant: "default",
    });

    return {
      content: `Dear Hiring Manager,

I am writing to express my strong interest in the position you mentioned. Based on my background and experience outlined in my CV, I believe I would be an excellent fit for this role.

My qualifications and experience align well with what you're looking for, and I am excited about the opportunity to contribute to your team. I am confident that my skills and passion make me a strong candidate.

Thank you for considering my application. I look forward to hearing from you soon.

Best regards,
[Your Name]

--- 
Note: This is a test response. The AI service will be restored shortly.`
    };
  }
}

// Re-export functions from dedicated services for backward compatibility
export { saveBio, getUserBios } from './bioService';
export { saveCoverLetter, getUserCoverLetters } from './coverLetterService';
