import { toast } from "@/components/ui/use-toast";

// Set a fixed API key for all users
const OPENAI_API_KEY = "your-openai-api-key-here"; // Replace with your actual OpenAI API key

export interface OpenAIResponse {
  content: string;
  error?: string;
}

export async function generateWithAI(prompt: string): Promise<OpenAIResponse> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a professional content writer specializing in creating engaging and personalized content.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast({
        title: "API Error",
        description: errorData.error?.message || "Failed to generate content",
        variant: "destructive",
      });
      return { content: "", error: errorData.error?.message || "API Error" };
    }

    const data = await response.json();
    return { content: data.choices[0].message.content };

  } catch (error) {
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to connect to OpenAI",
      variant: "destructive",
    });
    return { content: "", error: error instanceof Error ? error.message : "Connection error" };
  }
}

export function createBioPrompt(formData: any): string {
  const platformInfo = `Platform: ${formData.platform}`;
  const personalInfo = `Name: ${formData.name}, Profession: ${formData.profession}`;
  
  let additionalInfo = '';
  
  switch (formData.platform) {
    case 'linkedin':
      additionalInfo = `Experience: ${formData.experience}, Achievements: ${formData.achievements}, Interests: ${formData.interests}`;
      break;
    case 'twitter':
    case 'instagram':
    case 'threads':
      additionalInfo = `Interests: ${formData.interests}, Fun Facts: ${formData.funFacts}`;
      break;
    case 'tinder':
      additionalInfo = `Interests: ${formData.interests}, Fun Facts: ${formData.funFacts}, Looking For: ${formData.lookingFor}`;
      break;
    case 'resume':
      additionalInfo = `Experience: ${formData.experience}, Achievements: ${formData.achievements}`;
      break;
    case 'portfolio':
      additionalInfo = `Experience: ${formData.experience}, Achievements: ${formData.achievements}, Interests: ${formData.interests}`;
      break;
    case 'twitch':
      additionalInfo = `Games: ${formData.games}, Schedule: ${formData.schedule}, Interests: ${formData.interests}, Other Channels: ${formData.channels || ''}`;
      break;
    case 'facebook':
      additionalInfo = `Interests: ${formData.interests}, About Me: ${formData.funFacts || ''}`;
      break;
    case 'tiktok':
      additionalInfo = `Content Type: ${formData.content || ''}, Interests: ${formData.interests}`;
      break;
    case 'youtube':
      additionalInfo = `Content: ${formData.content || ''}, Schedule: ${formData.schedule || ''}, Topics: ${formData.interests}`;
      break;
    case 'reddit':
      additionalInfo = `Interests: ${formData.interests}, Subreddits: ${formData.communities || ''}, Additional Info: ${formData.funFacts || ''}`;
      break;
    case 'snapchat':
      additionalInfo = `About Me: ${formData.funFacts || ''}, Interests: ${formData.interests}, Snap Content: ${formData.content || ''}`;
      break;
    case 'pinterest':
      additionalInfo = `Niche: ${formData.niche || ''}, Interests: ${formData.interests}, Style: ${formData.style || ''}`;
      break;
  }
  
  const toneInfo = `Tone: ${formData.tone}`;
  const lengthInfo = `Length: ${formData.length}`;
  const charLimit = formData.charLimit ? `Character Limit: ${formData.customCharCount}` : 'No character limit';
  
  return `
    Please create a creative and engaging bio for ${formData.name} based on the following information:
    
    ${platformInfo}
    ${personalInfo}
    ${additionalInfo}
    ${toneInfo}
    ${lengthInfo}
    ${charLimit}
    
    Please create a bio specifically for the ${formData.platform} platform, respecting its common formats and conventions.
    Make it sound natural and authentic, not like an AI-generated template.
    Do not include any explanations, just provide the bio text.
  `;
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
