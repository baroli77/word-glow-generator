
import { supabase } from "@/integrations/supabase/client";
import { showToast } from "@/utils/toast";

export async function saveCoverLetter(jobTitle: string, companyName: string, content: string, formData: any) {
  try {
    // Get the current user's session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      showToast.error("Please sign in to save your cover letter");
      return false;
    }

    // First, ensure the user profile exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', session.user.id)
      .single();

    if (profileError || !profile) {
      // Create the profile if it doesn't exist
      const { error: createProfileError } = await supabase
        .from('profiles')
        .insert({
          id: session.user.id,
          email: session.user.email || '',
          full_name: session.user.user_metadata?.full_name || null
        });

      if (createProfileError) {
        console.error('Error creating profile:', createProfileError);
        showToast.error("Unable to create user profile. Please try again.");
        return false;
      }
    }

    // Now save the cover letter
    const { error } = await supabase
      .from('cover_letters')
      .insert({
        job_title: jobTitle,
        company_name: companyName,
        content,
        form_data: formData,
        user_id: session.user.id
      });
    
    if (error) {
      console.error('Error saving cover letter:', error);
      throw error;
    }
    
    showToast.success("Cover letter saved successfully!");
    
    return true;
  } catch (error) {
    console.error('saveCoverLetter error:', error);
    showToast.error("Failed to save cover letter. Please try again.");
    return false;
  }
}

export async function getUserCoverLetters() {
  try {
    // Get the current user's session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return [];
    }

    const { data, error } = await supabase
      .from('cover_letters')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    showToast.error("Failed to load cover letters");
    return [];
  }
}

function buildCoverLetterPrompt(formData: any, cvContent: string): string {
  const { jobTitle, companyName, additionalInfo, tone } = formData;
  
  return `Create a professional cover letter with the following requirements:

Job Title: ${jobTitle}
Company: ${companyName}
Tone: ${tone}
${additionalInfo ? `Additional Information: ${additionalInfo}` : ''}

CV Content:
${cvContent}

Please write a compelling cover letter that:
1. Uses a ${tone} tone throughout
2. Is written in first person (use "I", "my", "me")
3. Highlights relevant experience from the CV
4. Shows enthusiasm for the specific role and company
5. Is well-structured with proper paragraphs
6. Includes a professional greeting and closing
7. Is approximately 250-400 words long

The cover letter should be personalized based on the CV content and job requirements, demonstrating clear connections between the candidate's experience and the role.`;
}

export async function generateCoverLetter(formData: any, cvContent: string) {
  try {
    // Get the current user's session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      showToast.error("Please sign in to generate a cover letter");
      return { content: null, error: "Authentication required" };
    }

    // Build the prompt for the edge function
    const prompt = buildCoverLetterPrompt(formData, cvContent);
    console.log('Generated prompt for cover letter:', prompt.substring(0, 100) + '...');

    const response = await fetch(`https://qwlotordnpeaahjtqyel.supabase.co/functions/v1/generate-content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        prompt: prompt
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate cover letter');
    }

    const data = await response.json();
    return { content: data.content, error: null };
  } catch (error) {
    console.error('Error generating cover letter:', error);
    showToast.error("Failed to generate cover letter. Please try again.");
    return { content: null, error: error.message };
  }
}
