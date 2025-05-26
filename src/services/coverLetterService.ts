
import { generateWithAI } from "./supabaseService";

export function createCoverLetterPrompt(formData: any, parsedCV: string): string {
  return `Write a cover letter for a ${formData.jobTitle} role at ${formData.companyName} using a ${formData.tone} tone. Base it on this CV text: ${parsedCV}. Include strong intro, 2-3 paragraphs on relevant experience, and a confident closing.

${formData.additionalInfo ? `Additional context: ${formData.additionalInfo}` : ''}

Make the cover letter professional, engaging, and tailored to the specific role and company. Ensure it highlights the most relevant experience from the CV.`;
}

export async function generateCoverLetter(formData: any, parsedCV: string) {
  const prompt = createCoverLetterPrompt(formData, parsedCV);
  return await generateWithAI(prompt);
}
