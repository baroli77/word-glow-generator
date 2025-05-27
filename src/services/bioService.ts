
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
