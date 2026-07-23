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
      community_channels: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          icon: string | null
          id: string
          member_count: string | null
          name: string
          platform: string
          status: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          icon?: string | null
          id?: string
          member_count?: string | null
          name: string
          platform?: string
          status?: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          icon?: string | null
          id?: string
          member_count?: string | null
          name?: string
          platform?: string
          status?: string
          updated_at?: string
          url?: string
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
      payment_account_audit: {
        Row: {
          action: string
          admin_id: string
          admin_name: string | null
          created_at: string
          id: string
          new_values: Json | null
          payment_account_id: string | null
          previous_values: Json | null
        }
        Insert: {
          action: string
          admin_id: string
          admin_name?: string | null
          created_at?: string
          id?: string
          new_values?: Json | null
          payment_account_id?: string | null
          previous_values?: Json | null
        }
        Update: {
          action?: string
          admin_id?: string
          admin_name?: string | null
          created_at?: string
          id?: string
          new_values?: Json | null
          payment_account_id?: string | null
          previous_values?: Json | null
        }
        Relationships: []
      }
      payment_accounts: {
        Row: {
          account_name: string
          account_number: string
          bank_name: string
          created_at: string
          id: string
          is_default: boolean
          payment_method: string
          qr_code: string | null
          status: boolean
          updated_at: string
        }
        Insert: {
          account_name: string
          account_number: string
          bank_name: string
          created_at?: string
          id?: string
          is_default?: boolean
          payment_method?: string
          qr_code?: string | null
          status?: boolean
          updated_at?: string
        }
        Update: {
          account_name?: string
          account_number?: string
          bank_name?: string
          created_at?: string
          id?: string
          is_default?: boolean
          payment_method?: string
          qr_code?: string | null
          status?: boolean
          updated_at?: string
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
          telegram_join_completed: boolean
          telegram_onboarding_skipped: boolean
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
          telegram_join_completed?: boolean
          telegram_onboarding_skipped?: boolean
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
          telegram_join_completed?: boolean
          telegram_onboarding_skipped?: boolean
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
      referrals: {
        Row: {
          created_at: string
          id: string
          referee_profile_id: string
          referee_user_id: string
          referrer_profile_id: string
          reward_amount: number
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          referee_profile_id: string
          referee_user_id: string
          referrer_profile_id: string
          reward_amount?: number
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          referee_profile_id?: string
          referee_user_id?: string
          referrer_profile_id?: string
          reward_amount?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referee_profile_id_fkey"
            columns: ["referee_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referrer_profile_id_fkey"
            columns: ["referrer_profile_id"]
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
      transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          type?: string
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
          approved_at: string | null
          bank_name: string
          bvn: string | null
          created_at: string
          fpc_code: string | null
          id: string
          rejection_reason: string | null
          reviewed_at: string | null
          status: string
          user_id: string
          withdrawal_code: string | null
        }
        Insert: {
          account_name: string
          account_number: string
          amount: number
          approved_at?: string | null
          bank_name: string
          bvn?: string | null
          created_at?: string
          fpc_code?: string | null
          id?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          status?: string
          user_id: string
          withdrawal_code?: string | null
        }
        Update: {
          account_name?: string
          account_number?: string
          amount?: number
          approved_at?: string | null
          bank_name?: string
          bvn?: string | null
          created_at?: string
          fpc_code?: string | null
          id?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          status?: string
          user_id?: string
          withdrawal_code?: string | null
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
      admin_create_payment_account: {
        Args: {
          p_account_name: string
          p_account_number: string
          p_bank_name: string
          p_is_default: boolean
          p_payment_method: string
          p_qr_code: string
          p_status: boolean
        }
        Returns: string
      }
      admin_delete_fpc_code: { Args: { p_id: string }; Returns: undefined }
      admin_delete_payment_account: {
        Args: { p_id: string }
        Returns: undefined
      }
      admin_regenerate_fpc_code: { Args: { p_id: string }; Returns: string }
      admin_reset_telegram_join: {
        Args: { p_profile_id: string }
        Returns: undefined
      }
      admin_reset_telegram_onboarding: {
        Args: { p_profile_id: string }
        Returns: undefined
      }
      admin_set_default_payment_account: {
        Args: { p_id: string }
        Returns: undefined
      }
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
          reason?: string
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
      complete_telegram_join: { Args: Record<string, never>; Returns: undefined }
      generate_fpc_code: { Args: Record<string, never>; Returns: string }
      generate_referral_code: { Args: Record<string, never>; Returns: string }
      generate_withdrawal_code: { Args: Record<string, never>; Returns: string }
      get_admin_display_name: {
        Args: { _uid: string }
        Returns: string
      }
      handle_new_user: { Args: Record<string, never>; Returns: undefined }
      handle_payment_confirmed: { Args: Record<string, never>; Returns: undefined }
      has_role: {
        Args: { _role: Database["public"]["Enums"]["app_role"]; _user_id: string }
        Returns: boolean
      }
      is_current_user_admin: { Args: Record<string, never>; Returns: boolean }
      is_current_user_super_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
      lookup_referrer_id: { Args: { p_code: string }; Returns: string }
      process_referral: {
        Args: { p_code: string; p_referee_id: string }
        Returns: undefined
      }
      skip_telegram_onboarding: { Args: Record<string, never>; Returns: undefined }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database["public"]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] & {
      Schema: PublicTableNameOrOptions["schema"]
    }
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] & PublicSchema["Views"])[PublicTableNameOrOptions] & {
        Schema: "public"
      }
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
