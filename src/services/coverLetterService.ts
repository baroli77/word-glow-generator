
import { generateWithAI } from "./supabaseService";
import { toast } from "@/hooks/use-toast";

export function createCoverLetterPrompt(formData: any, parsedCV: string): string {
  return `Write a cover letter for a ${formData.jobTitle} role at ${formData.companyName} using a ${formData.tone} tone. Base it on this CV text: ${parsedCV}. Include strong intro, 2-3 paragraphs on relevant experience, and a confident closing.

${formData.additionalInfo ? `Additional context: ${formData.additionalInfo}` : ''}

Make the cover letter professional, engaging, and tailored to the specific role and company. Ensure it highlights the most relevant experience from the CV.`;
}

export async function generateCoverLetter(formData: any, parsedCV: string) {
  // Validate CV content before proceeding
  if (!parsedCV || typeof parsedCV !== 'string' || parsedCV.trim().length < 100) {
    const errorMessage = "Your CV couldn't be processed. Try a different file.";
    toast({
      title: "CV Processing Error",
      description: errorMessage,
      variant: "destructive",
    });
    return { content: '', error: errorMessage };
  }

  try {
    const prompt = createCoverLetterPrompt(formData, parsedCV);
    const result = await generateWithAI(prompt);

    // Validate the generated content
    if (!result.content || typeof result.content !== 'string' || result.content.trim().length === 0) {
      const errorMessage = "Cover letter generation failed. Try again or re-upload your CV.";
      toast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return { content: '', error: errorMessage };
    }

    return { content: result.content.trim() };
  } catch (error) {
    console.error('Cover letter generation error:', error);
    const errorMessage = "Cover letter generation failed. Try again or re-upload your CV.";
    toast({
      title: "Generation Failed",
      description: errorMessage,
      variant: "destructive",
    });
    return { content: '', error: errorMessage };
  }
}
