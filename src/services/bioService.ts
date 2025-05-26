
import { generateWithAI } from "./supabaseService";
import { toast } from "@/components/ui/use-toast";
import { BioFormData } from "../components/bio-generator/types";
import { PromptBuilder } from "./bio-generation/prompt-builder";
import { BioSimulator } from "./bio-generation/bio-simulator";

export interface BioGenerationResponse {
  content: string;
  error?: string;
}

export async function generateBio(formData: BioFormData): Promise<BioGenerationResponse> {
  try {
    const promptBuilder = new PromptBuilder(formData);
    const prompt = promptBuilder.build();
    
    const response = await generateWithAI(prompt);
    
    if (response.error) {
      toast({
        title: "Generation Error",
        description: response.error,
        variant: "destructive",
      });
      return { content: "", error: response.error };
    }
    
    let bio = response.content.trim();
    
    // Apply character limit if enabled
    if (formData.charLimit && formData.customCharCount > 0) {
      bio = bio.substring(0, formData.customCharCount);
    }
    
    return { content: bio };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to generate bio";
    console.error("Error generating bio:", error);
    
    toast({
      title: "Generation Failed",
      description: errorMessage,
      variant: "destructive",
    });
    
    return { content: "", error: errorMessage };
  }
}

export function simulateBioGeneration(formData: BioFormData): string {
  const simulator = new BioSimulator(formData);
  return simulator.simulate();
}

// Legacy function for backward compatibility
export function createBioPrompt(formData: BioFormData): string {
  const promptBuilder = new PromptBuilder(formData);
  return promptBuilder.build();
}
