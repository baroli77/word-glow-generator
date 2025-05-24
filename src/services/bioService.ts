
import { generateWithAI } from "./supabaseService";
import { toast } from "@/components/ui/use-toast";
import { BioFormData } from "../components/bio-generator/types";

export interface BioGenerationResponse {
  content: string;
  error?: string;
}

export async function generateBio(formData: BioFormData): Promise<BioGenerationResponse> {
  try {
    const prompt = createBioPrompt(formData);
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

export function createBioPrompt(formData: BioFormData): string {
  const platformInfo = `Platform: ${formData.platform}`;
  const personalInfo = `Name: ${formData.name}, Profession: ${formData.profession}`;
  
  let additionalInfo = '';
  
  // Type-safe access to platform-specific fields
  if ('experience' in formData) {
    additionalInfo += `Experience: ${formData.experience}`;
  }
  if ('achievements' in formData) {
    additionalInfo += `, Achievements: ${formData.achievements}`;
  }
  if ('interests' in formData) {
    additionalInfo += `, Interests: ${formData.interests}`;
  }
  if ('funFacts' in formData) {
    additionalInfo += `, Fun Facts: ${formData.funFacts}`;
  }
  if ('lookingFor' in formData) {
    additionalInfo += `, Looking For: ${formData.lookingFor}`;
  }
  if ('games' in formData) {
    additionalInfo += `, Games: ${formData.games}`;
  }
  if ('schedule' in formData) {
    additionalInfo += `, Schedule: ${formData.schedule}`;
  }
  if ('content' in formData) {
    additionalInfo += `, Content: ${formData.content}`;
  }
  if ('communities' in formData) {
    additionalInfo += `, Communities: ${formData.communities}`;
  }
  if ('niche' in formData) {
    additionalInfo += `, Niche: ${formData.niche}`;
  }
  if ('style' in formData) {
    additionalInfo += `, Style: ${formData.style}`;
  }
  
  const toneInfo = `Tone: ${formData.tone}`;
  const charLimit = formData.charLimit ? `Character Limit: ${formData.customCharCount}` : 'No character limit';
  
  return `
    Please create a creative and engaging bio for ${formData.name} based on the following information:
    
    ${platformInfo}
    ${personalInfo}
    ${additionalInfo}
    ${toneInfo}
    ${charLimit}
    
    Please create a bio specifically for the ${formData.platform} platform, respecting its common formats and conventions.
    Make it sound natural and authentic, not like an AI-generated template.
    Do not include any explanations, just provide the bio text.
  `;
}

// Fallback simulation for when AI generation fails
export function simulateBioGeneration(formData: BioFormData): string {
  let simulatedBio = '';
  
  switch(formData.platform) {
    case 'linkedin':
      simulatedBio = `I'm ${formData.name}, a ${formData.tone} ${formData.profession}. 
      ${('experience' in formData && formData.experience) ? `With experience in ${formData.experience}, ` : ''}
      I'm passionate about using my skills to make a difference and always looking for new opportunities to grow.`;
      break;
    case 'twitter':
      simulatedBio = `${formData.name} | ${formData.profession}
      ${('interests' in formData && formData.interests) ? `Interested in ${formData.interests}` : ''}
      Tweets about tech, insights, and occasional ${formData.tone} thoughts.`;
      break;
    case 'instagram':
      simulatedBio = `✨ ${formData.name} ✨
      ${formData.profession}
      ${('interests' in formData && formData.interests) ? `Passionate about ${formData.interests}` : ''}
      📸 Sharing moments and adventures`;
      break;
    default:
      simulatedBio = `${formData.name} - ${formData.profession}. ${formData.tone} and passionate about what I do.`;
  }
  
  // Apply character limit if enabled
  if (formData.charLimit && formData.customCharCount > 0) {
    simulatedBio = simulatedBio.substring(0, formData.customCharCount);
  }
  
  return simulatedBio;
}
