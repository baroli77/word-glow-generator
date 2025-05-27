
import { supabase } from "@/integrations/supabase/client";
import { showToast } from "@/utils/toast";
import { PromptBuilder } from "./bio-generation/prompt-builder";
import { BioSimulator } from "./bio-generation/bio-simulator";

export async function saveBio(platform: string, content: string, formData: any) {
  try {
    // Get the current user's session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      showToast.error("Please sign in to save your bio");
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
    
    showToast.success("Bio saved successfully!");
    
    return true;
  } catch (error) {
    showToast.error("Failed to save bio");
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
    showToast.error("Failed to load bios");
    return [];
  }
}

export async function generateBio(formData: any) {
  try {
    // Get the current user's session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      showToast.error("Please sign in to generate a bio");
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
