
import { generateWithAI } from "./supabaseService";
import { toast } from "@/components/ui/use-toast";
import { BioFormData } from "../components/bio-generator/types";

export interface BioGenerationResponse {
  content: string;
  error?: string;
}

export async function generateBio(formData: BioFormData): Promise<BioGenerationResponse> {
  try {
    const prompt = createPlatformSpecificPrompt(formData);
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

function getPlatformCategory(platform: string): string {
  const categories = {
    professional: ['linkedin', 'resume', 'portfolio'],
    social: ['instagram', 'facebook', 'threads', 'snapchat'],
    content: ['youtube', 'tiktok', 'twitch', 'pinterest', 'reddit'],
    dating: ['tinder', 'bumble', 'hinge', 'pof']
  };

  for (const [category, platforms] of Object.entries(categories)) {
    if (platforms.includes(platform)) {
      return category;
    }
  }
  
  // Twitter is special - treat as professional for now
  if (platform === 'twitter') return 'professional';
  
  return 'professional'; // default fallback
}

function getQuirkFromFormData(formData: BioFormData): string {
  // Extract quirk/unique info from form data based on platform
  if ('interests' in formData && formData.interests) {
    return formData.interests;
  }
  if ('funFacts' in formData && formData.funFacts) {
    return formData.funFacts;
  }
  if ('achievements' in formData && formData.achievements) {
    return formData.achievements;
  }
  if ('experience' in formData && formData.experience) {
    return formData.experience;
  }
  
  return 'their unique perspective and approach';
}

function createPlatformSpecificPrompt(formData: BioFormData): string {
  const category = getPlatformCategory(formData.platform);
  const tone = formData.tone;
  const profession = formData.profession;
  const quirk = getQuirkFromFormData(formData);
  const platform = formData.platform;
  
  let basePrompt = '';
  
  switch (category) {
    case 'professional':
      basePrompt = `Write a short and punchy professional bio. This person is a ${profession}. 
Tone: ${tone}. 
Include something unique about them: ${quirk}. 
Avoid buzzwords like 'passionate', 'dedicated', 'expert'. 
No greetings or hashtags.`;
      break;
      
    case 'social':
      basePrompt = `Write a creative and casual social media bio. 
Tone: ${tone}. 
Include this detail: ${quirk}. 
Use short fragments or emojis if relevant. 
No intros or full sentences.`;
      break;
      
    case 'content':
      basePrompt = `Write a creator-style bio for ${platform}. 
Tone: ${tone}. 
Include this detail: ${quirk}. 
Make it edgy, fun, or intriguing — whatever fits the tone.`;
      break;
      
    case 'dating':
      basePrompt = `Write a dating profile bio. 
Tone: ${tone}. 
Include this personal detail or quirk: ${quirk}. 
Avoid generic statements like 'I love long walks on the beach'. 
Be clever, human, and memorable.`;
      break;
      
    default:
      basePrompt = `Write a bio for ${platform}. 
Tone: ${tone}. 
Include this detail: ${quirk}.`;
  }
  
  // Add character limit instruction if enabled
  if (formData.charLimit && formData.customCharCount > 0) {
    basePrompt += ` Max ${formData.customCharCount} characters.`;
  }
  
  // Add final instructions
  basePrompt += `

Important: 
- Do not include any intros like "Hi, I'm..." or endings like "Thanks for reading"
- Keep it direct and authentic
- Avoid corporate fluff and generic phrases
- Make it feel human and genuine
- Generate exactly one bio, nothing else`;

  return basePrompt;
}

// Legacy function for backward compatibility
export function createBioPrompt(formData: BioFormData): string {
  return createPlatformSpecificPrompt(formData);
}

// Fallback simulation for when AI generation fails
export function simulateBioGeneration(formData: BioFormData): string {
  const category = getPlatformCategory(formData.platform);
  let simulatedBio = '';
  
  switch(category) {
    case 'professional':
      simulatedBio = `${formData.profession} with a ${formData.tone} approach to work. 
      ${('experience' in formData && formData.experience) ? `Experienced in ${formData.experience}. ` : ''}
      Always looking for new opportunities to grow and make an impact.`;
      break;
      
    case 'social':
      simulatedBio = `${formData.profession} ✨
      ${('interests' in formData && formData.interests) ? `${formData.interests} enthusiast` : ''}
      Living life with a ${formData.tone} vibe 📸`;
      break;
      
    case 'content':
      simulatedBio = `Creating ${formData.tone} content on ${formData.platform}
      ${('interests' in formData && formData.interests) ? `${formData.interests} ` : ''}
      Join the journey! 🎬`;
      break;
      
    case 'dating':
      simulatedBio = `${formData.profession} with a ${formData.tone} personality.
      ${('interests' in formData && formData.interests) ? `Love ${formData.interests}. ` : ''}
      Looking for genuine connections.`;
      break;
      
    default:
      simulatedBio = `${formData.name} - ${formData.profession}. ${formData.tone} and authentic.`;
  }
  
  // Apply character limit if enabled
  if (formData.charLimit && formData.customCharCount > 0) {
    simulatedBio = simulatedBio.substring(0, formData.customCharCount);
  }
  
  return simulatedBio;
}
