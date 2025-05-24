
import { generateWithAI as generateAI } from "./supabaseService";
import { toast } from "@/components/ui/use-toast";

// Cache to store previously generated content
const contentCache: Record<string, string> = {};

// Simple hash function for caching
const hashPrompt = (prompt: string): string => {
  let hash = 0;
  for (let i = 0; i < prompt.length; i++) {
    const char = prompt.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString();
};

export interface OpenAIResponse {
  content: string;
  error?: string;
}

export async function generateWithAI(prompt: string, retryCount = 0): Promise<OpenAIResponse> {
  const cacheKey = hashPrompt(prompt);
  
  // Check cache first
  if (contentCache[cacheKey]) {
    return { content: contentCache[cacheKey] };
  }

  try {
    const response = await generateAI(prompt);
    
    if (response.error) {
      toast({
        title: "Error",
        description: response.error,
        variant: "destructive",
      });
      return { content: "", error: response.error };
    }
    
    // Store in cache
    contentCache[cacheKey] = response.content;
    
    return response;
  } catch (error) {
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to generate content",
      variant: "destructive",
    });
    return { content: "", error: error instanceof Error ? error.message : "Error generating content" };
  }
}

export function createCoverLetterPrompt(formData: any, fileName: string): string {
  return `
    Please create a professional cover letter for a job application with the following details:
    
    Job Title: ${formData.jobTitle}
    Company: ${formData.companyName}
    CV File: ${fileName}
    Additional Information: ${formData.additionalInfo || 'None provided'}
    Tone: ${formData.tone}
    
    Write a complete, professional cover letter that's ready to be sent.
    Highlight qualifications, relevant experience, and enthusiasm for the role.
    Use a standard cover letter format with appropriate salutation and closing.
    Do not include any explanations, just provide the cover letter text.
  `;
}
