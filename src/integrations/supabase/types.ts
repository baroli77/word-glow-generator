export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_roles: {
        Row: {
          created_at: string
          email: string
          id: string
          is_active: boolean
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          user_id?: string | null
        }
        Relationships: []
      }
      bios: {
        Row: {
          content: string
          created_at: string
          form_data: Json
          id: string
          platform: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          form_data: Json
          id?: string
          platform: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          form_data?: Json
          id?: string
          platform?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      cover_letters: {
        Row: {
          company_name: string
          content: string
          created_at: string
          form_data: Json
          id: string
          job_title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company_name: string
          content: string
          created_at?: string
          form_data: Json
          id?: string
          job_title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          company_name?: string
          content?: string
          created_at?: string
          form_data?: Json
          id?: string
          job_title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cover_letters_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      tool_usage: {
        Row: {
          created_at: string
          id: string
          tool_type: string
          usage_date: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          tool_type: string
          usage_date?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          tool_type?: string
          usage_date?: string
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          cancel_requested: boolean | null
          created_at: string
          customer_id: string | null
          expires_at: string | null
          id: string
          is_active: boolean
          plan_type: string
          subscription_cancelled: boolean | null
          subscription_id: string | null
          subscription_start: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_requested?: boolean | null
          created_at?: string
          customer_id?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          plan_type: string
          subscription_cancelled?: boolean | null
          subscription_id?: string | null
          subscription_start?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_requested?: boolean | null
          created_at?: string
          customer_id?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          plan_type?: string
          subscription_cancelled?: boolean | null
          subscription_id?: string | null
          subscription_start?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      auto_expire_subscriptions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      can_use_tool: {
        Args: { user_id_param: string; tool_type_param: string }
        Returns: boolean
      }
      check_user_subscription_expiry: {
        Args: { target_user_id: string }
        Returns: {
          expired: boolean
          old_plan_type: string
          new_plan_type: string
        }[]
      }
      delete_user_and_data: {
        Args: { user_email: string }
        Returns: undefined
      }
      expire_old_daily_plans: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_all_users_admin: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          email: string
          full_name: string
          created_at: string
          plan_type: string
          is_active: boolean
          expires_at: string
        }[]
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      update_user_subscription_admin: {
        Args: {
          target_user_id: string
          new_plan_type: string
          new_is_active?: boolean
          new_expires_at?: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
