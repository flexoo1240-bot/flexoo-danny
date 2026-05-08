export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      app_settings: {
        Row: {
          key: string
          updated_at: string
          value: string | null
        }
        Insert: {
          key: string
          updated_at?: string
          value?: string | null
        }
        Update: {
          key?: string
          updated_at?: string
          value?: string | null
        }
        Relationships: []
      }
      daily_tasks: {
        Row: {
          completed_at: string
          id: string
          points_earned: number
          task_type: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          id?: string
          points_earned?: number
          task_type: string
          user_id: string
        }
        Update: {
          completed_at?: string
          id?: string
          points_earned?: number
          task_type?: string
          user_id?: string
        }
        Relationships: []
      }
      fpc_codes: {
        Row: {
          code: string
          created_at: string
          id: string
          payment_id: string
          used: boolean
          used_at: string | null
          used_for_withdrawal_id: string | null
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          payment_id: string
          used?: boolean
          used_at?: string | null
          used_for_withdrawal_id?: string | null
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          payment_id?: string
          used?: boolean
          used_at?: string | null
          used_for_withdrawal_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          receipt_url: string | null
          reviewed_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: string
          receipt_url?: string | null
          reviewed_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          receipt_url?: string | null
          reviewed_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          bonus_balance: number
          created_at: string
          full_name: string
          id: string
          level: string
          phone: string | null
          referral_code: string | null
          referred_by: string | null
          total_tasks_completed: number
          updated_at: string
          user_id: string
          username: string
        }
        Insert: {
          bonus_balance?: number
          created_at?: string
          full_name?: string
          id?: string
          level?: string
          phone?: string | null
          referral_code?: string | null
          referred_by?: string | null
          total_tasks_completed?: number
          updated_at?: string
          user_id: string
          username?: string
        }
        Update: {
          bonus_balance?: number
          created_at?: string
          full_name?: string
          id?: string
          level?: string
          phone?: string | null
          referral_code?: string | null
          referred_by?: string | null
          total_tasks_completed?: number
          updated_at?: string
          user_id?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      spin_history: {
        Row: {
          amount: number
          id: string
          spun_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          id?: string
          spun_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          id?: string
          spun_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      withdrawal_requests: {
        Row: {
          account_name: string
          account_number: string
          amount: number
          bank_name: string
          bvn: string | null
          created_at: string
          fpc_code: string | null
          id: string
          reviewed_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          account_name: string
          account_number: string
          amount: number
          bank_name: string
          bvn?: string | null
          created_at?: string
          fpc_code?: string | null
          id?: string
          reviewed_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          account_name?: string
          account_number?: string
          amount?: number
          bank_name?: string
          bvn?: string | null
          created_at?: string
          fpc_code?: string | null
          id?: string
          reviewed_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_create_fpc_code: {
        Args: { p_code: string; p_payment_id: string; p_user_id: string }
        Returns: string
      }
      admin_delete_fpc_code: { Args: { p_id: string }; Returns: undefined }
      admin_regenerate_fpc_code: { Args: { p_id: string }; Returns: string }
      admin_toggle_fpc_used: {
        Args: { p_id: string; p_used: boolean }
        Returns: undefined
      }
      admin_update_payment: {
        Args: {
          p_amount: number
          p_id: string
          p_receipt_url: string
          p_status: string
        }
        Returns: undefined
      }
      admin_update_payment_status: {
        Args: { p_id: string; p_status: string }
        Returns: undefined
      }
      admin_update_setting: {
        Args: { p_key: string; p_value: string }
        Returns: undefined
      }
      admin_update_user_profile: {
        Args: { p_balance: number; p_level: string; p_profile_id: string }
        Returns: undefined
      }
      admin_update_withdrawal: {
        Args: {
          admin_user_id: string
          new_status: string
          withdrawal_id: string
        }
        Returns: undefined
      }
      admin_update_withdrawal_account: {
        Args: {
          p_account_name: string
          p_account_number: string
          p_bank: string
          p_id: string
        }
        Returns: undefined
      }
      generate_fpc_code: { Args: never; Returns: string }
      generate_referral_code: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_current_user_admin: { Args: never; Returns: boolean }
      process_referral: {
        Args: { new_user_id: string; referrer_code: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
