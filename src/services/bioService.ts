
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export async function saveBio(platform: string, content: string, formData: any) {
  try {
    // Get the current user's session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save your bio.",
        variant: "destructive",
      });
      return false;
    }

    const { error } = await supabase
      .from('bios')
      .insert({
        platform,
        content,
        form_data: formData,
        user_id: session.user.id
      });
    
    if (error) throw error;
    
    toast({
      title: "Bio saved",
      description: "Your bio has been saved successfully."
    });
    
    return true;
  } catch (error) {
    toast({
      title: "Error saving bio",
      description: error.message,
      variant: "destructive"
    });
    return false;
  }
}

export async function getUserBios() {
  try {
    // Get the current user's session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return [];
    }

    const { data, error } = await supabase
      .from('bios')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    toast({
      title: "Error loading bios",
      description: error.message,
      variant: "destructive"
    });
    return [];
  }
}

export async function generateBio(formData: any) {
  try {
    const response = await fetch(`https://qwlotordnpeaahjtqyel.supabase.co/functions/v1/generate-content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabase.supabaseKey}`,
      },
      body: JSON.stringify({
        type: 'bio',
        formData
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate bio');
    }

    const data = await response.json();
    return { content: data.content, error: null };
  } catch (error) {
    console.error('Error generating bio:', error);
    return { content: null, error: error.message };
  }
}

export function simulateBioGeneration(formData: any) {
  const { platform, name, profession, tone } = formData;
  
  // Create a simple template-based bio as fallback
  const templates = {
    professional: `${name} is a ${profession} with expertise in delivering high-quality results. Known for professionalism and dedication to excellence.`,
    casual: `Hey! I'm ${name}, a ${profession} who loves what I do. Always up for new challenges and connecting with great people.`,
    creative: `${name} - ${profession} with a passion for innovation and creativity. Turning ideas into reality, one project at a time.`,
    confident: `${name} | ${profession} | Expert in my field with a proven track record of success. Let's make great things happen together.`
  };

  return templates[tone] || templates.professional;
}
