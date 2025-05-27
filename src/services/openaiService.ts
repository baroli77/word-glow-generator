
import { generateWithAI as generateAI } from "./supabaseService";
import { showToast } from "@/utils/toast";

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
      showToast.error(response.error);
      return { content: "", error: response.error };
    }
    
    // Store in cache
    contentCache[cacheKey] = response.content;
    
    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to generate content";
    showToast.error(errorMessage);
    return { content: "", error: errorMessage };
  }
}
