
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  plan_type: string;
  is_active: boolean;
  expires_at: string | null;
}

export async function getAllUsers(): Promise<AdminUser[]> {
  try {
    console.log('Calling get_all_users_admin function...');
    
    const { data, error } = await supabase.rpc('get_all_users_admin');
    
    if (error) {
      console.error('Error from get_all_users_admin:', error);
      toast({
        title: "Error loading users",
        description: error.message,
        variant: "destructive"
      });
      return [];
    }
    
    console.log('Users loaded successfully:', data);
    return (data as AdminUser[]) || [];
  } catch (error) {
    console.error('Unexpected error in getAllUsers:', error);
    toast({
      title: "Error loading users",
      description: "Failed to connect to database",
      variant: "destructive"
    });
    return [];
  }
}

export async function updateUserSubscription(
  userId: string, 
  planType: string,
  isActive: boolean = true,
  expiresAt: string | null = null
): Promise<boolean> {
  try {
    console.log('Updating user subscription:', { userId, planType, isActive, expiresAt });
    
    const { data, error } = await supabase.rpc('update_user_subscription_admin', {
      target_user_id: userId,
      new_plan_type: planType,
      new_is_active: isActive,
      new_expires_at: expiresAt
    });
    
    if (error) {
      console.error('Error updating subscription:', error);
      toast({
        title: "Error updating subscription",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
    
    console.log('Subscription updated successfully');
    toast({
      title: "Subscription updated",
      description: "User subscription has been updated successfully."
    });
    
    return true;
  } catch (error) {
    console.error('Unexpected error in updateUserSubscription:', error);
    toast({
      title: "Error updating subscription",
      description: "Failed to connect to database",
      variant: "destructive"
    });
    return false;
  }
}
