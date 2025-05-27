
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export async function saveCoverLetter(jobTitle: string, companyName: string, content: string, formData: any) {
  try {
    // Get the current user's session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save your cover letter.",
        variant: "destructive",
      });
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
        toast({
          title: "Profile Error",
          description: "Unable to create user profile. Please try again.",
          variant: "destructive",
        });
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
    
    toast({
      title: "Cover letter saved",
      description: "Your cover letter has been saved successfully."
    });
    
    return true;
  } catch (error) {
    console.error('saveCoverLetter error:', error);
    toast({
      title: "Error saving cover letter",
      description: "Failed to save cover letter. Please try again.",
      variant: "destructive"
    });
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
    toast({
      title: "Error loading cover letters",
      description: error.message,
      variant: "destructive"
    });
    return [];
  }
}

export async function generateCoverLetter(formData: any, cvContent: string) {
  try {
    // Get the current user's session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to generate a cover letter.",
        variant: "destructive",
      });
      return { content: null, error: "Authentication required" };
    }

    const response = await fetch(`https://qwlotordnpeaahjtqyel.supabase.co/functions/v1/generate-content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        type: 'cover_letter',
        formData: {
          ...formData,
          cvContent
        }
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate cover letter');
    }

    const data = await response.json();
    return { content: data.content, error: null };
  } catch (error) {
    console.error('Error generating cover letter:', error);
    toast({
      title: "Generation Error",
      description: "Failed to generate cover letter. Please try again.",
      variant: "destructive"
    });
    return { content: null, error: error.message };
  }
}
