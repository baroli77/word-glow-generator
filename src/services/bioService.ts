import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { PromptBuilder } from "./bio-generation/prompt-builder";
import { BioSimulator } from "./bio-generation/bio-simulator";

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
    // Get the current user's session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to generate a bio.",
        variant: "destructive",
      });
      return { content: null, error: "Authentication required" };
    }

    // Build the prompt using the PromptBuilder
    const promptBuilder = new PromptBuilder(formData);
    const prompt = promptBuilder.build();

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
  const bioSimulator = new BioSimulator(formData);
  return bioSimulator.simulate();
}
