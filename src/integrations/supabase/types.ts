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
      bill_items: {
        Row: {
          amount: number
          bill_id: string
          created_at: string
          description: string
          id: string
          quantity: number
          updated_at: string
        }
        Insert: {
          amount: number
          bill_id: string
          created_at?: string
          description: string
          id?: string
          quantity?: number
          updated_at?: string
        }
        Update: {
          amount?: number
          bill_id?: string
          created_at?: string
          description?: string
          id?: string
          quantity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bill_items_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "bills"
            referencedColumns: ["id"]
          },
        ]
      }
      bills: {
        Row: {
          created_at: string
          customer_name: string
          id: string
          issued_date: string
          notes: string | null
          payment_date: string | null
          payment_method: string | null
          reservation_id: string | null
          status: string
          total_amount: number
          updated_at: string
          villa_id: string | null
        }
        Insert: {
          created_at?: string
          customer_name: string
          id?: string
          issued_date?: string
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          reservation_id?: string | null
          status: string
          total_amount: number
          updated_at?: string
          villa_id?: string | null
        }
        Update: {
          created_at?: string
          customer_name?: string
          id?: string
          issued_date?: string
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          reservation_id?: string | null
          status?: string
          total_amount?: number
          updated_at?: string
          villa_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bills_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bills_villa_id_fkey"
            columns: ["villa_id"]
            isOneToOne: false
            referencedRelation: "villas"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          id: string
          name: string
          parent_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          parent_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          parent_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      email_logs: {
        Row: {
          bill_id: string | null
          created_at: string
          id: string
          recipient: string
          reservation_id: string | null
          sent_at: string
          sent_by: string | null
          status: string
          subject: string
          template_type: string
        }
        Insert: {
          bill_id?: string | null
          created_at?: string
          id?: string
          recipient: string
          reservation_id?: string | null
          sent_at?: string
          sent_by?: string | null
          status?: string
          subject: string
          template_type: string
        }
        Update: {
          bill_id?: string | null
          created_at?: string
          id?: string
          recipient?: string
          reservation_id?: string | null
          sent_at?: string
          sent_by?: string | null
          status?: string
          subject?: string
          template_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "bills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_logs_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          body: string
          created_at: string
          id: string
          name: string
          subject: string
          template_type: string
          updated_at: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          name: string
          subject: string
          template_type: string
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          name?: string
          subject?: string
          template_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      imotidesk_blog_posts: {
        Row: {
          author_id: string | null
          category: string
          content: string
          created_at: string | null
          excerpt: string
          id: string
          image_url: string | null
          published_at: string | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          category: string
          content: string
          created_at?: string | null
          excerpt: string
          id?: string
          image_url?: string | null
          published_at?: string | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          category?: string
          content?: string
          created_at?: string | null
          excerpt?: string
          id?: string
          image_url?: string | null
          published_at?: string | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      imotidesk_blog_views: {
        Row: {
          blog_post_id: string
          id: string
          ip_address: string | null
          user_agent: string | null
          user_id: string | null
          viewed_at: string | null
        }
        Insert: {
          blog_post_id: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
          viewed_at?: string | null
        }
        Update: {
          blog_post_id?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "imotidesk_blog_views_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "imotidesk_blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "imotidesk_blog_views_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "imotidesk_blog_views_count"
            referencedColumns: ["blog_post_id"]
          },
        ]
      }
      imotidesk_careers: {
        Row: {
          created_at: string | null
          department: string
          description: string
          id: string
          is_active: boolean | null
          location: string
          requirements: string
          title: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          department: string
          description: string
          id?: string
          is_active?: boolean | null
          location: string
          requirements: string
          title: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string
          description?: string
          id?: string
          is_active?: boolean | null
          location?: string
          requirements?: string
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      imotidesk_careers_applications: {
        Row: {
          cover_letter: string | null
          created_at: string | null
          cv_url: string | null
          email: string
          full_name: string
          id: string
          phone: string
          position_id: string | null
          status: string | null
        }
        Insert: {
          cover_letter?: string | null
          created_at?: string | null
          cv_url?: string | null
          email: string
          full_name: string
          id?: string
          phone: string
          position_id?: string | null
          status?: string | null
        }
        Update: {
          cover_letter?: string | null
          created_at?: string | null
          cv_url?: string | null
          email?: string
          full_name?: string
          id?: string
          phone?: string
          position_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "imotidesk_careers_applications_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "imotidesk_careers"
            referencedColumns: ["id"]
          },
        ]
      }
      imotidesk_inquiries: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string | null
          name: string
          phone: string
          property_id: string
          responded: boolean | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message?: string | null
          name: string
          phone: string
          property_id: string
          responded?: boolean | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string | null
          name?: string
          phone?: string
          property_id?: string
          responded?: boolean | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "imotidesk_inquiries_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "imotidesk_properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "imotidesk_inquiries_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "imotidesk_property_views_count"
            referencedColumns: ["property_id"]
          },
        ]
      }
      imotidesk_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          role: Database["public"]["Enums"]["app_role"] | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"] | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      imotidesk_properties: {
        Row: {
          address: string
          agent_id: string | null
          area: number | null
          bathrooms: number | null
          bedrooms: number | null
          city: string
          created_at: string | null
          description: string | null
          id: string
          images: string[] | null
          is_exclusive: boolean | null
          is_featured: boolean | null
          is_published: boolean | null
          latitude: number | null
          listing_type: string
          longitude: number | null
          owner_id: string
          price: number
          property_type: string
          sub_district: string | null
          title: string
          updated_at: string | null
          virtual_tour_url: string | null
        }
        Insert: {
          address: string
          agent_id?: string | null
          area?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          city: string
          created_at?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          is_exclusive?: boolean | null
          is_featured?: boolean | null
          is_published?: boolean | null
          latitude?: number | null
          listing_type: string
          longitude?: number | null
          owner_id: string
          price: number
          property_type: string
          sub_district?: string | null
          title: string
          updated_at?: string | null
          virtual_tour_url?: string | null
        }
        Update: {
          address?: string
          agent_id?: string | null
          area?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          city?: string
          created_at?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          is_exclusive?: boolean | null
          is_featured?: boolean | null
          is_published?: boolean | null
          latitude?: number | null
          listing_type?: string
          longitude?: number | null
          owner_id?: string
          price?: number
          property_type?: string
          sub_district?: string | null
          title?: string
          updated_at?: string | null
          virtual_tour_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "imotidesk_properties_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "imotidesk_team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      imotidesk_property_views: {
        Row: {
          id: string
          ip_address: string | null
          property_id: string
          user_agent: string | null
          user_id: string | null
          viewed_at: string | null
        }
        Insert: {
          id?: string
          ip_address?: string | null
          property_id: string
          user_agent?: string | null
          user_id?: string | null
          viewed_at?: string | null
        }
        Update: {
          id?: string
          ip_address?: string | null
          property_id?: string
          user_agent?: string | null
          user_id?: string | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "imotidesk_property_views_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "imotidesk_properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "imotidesk_property_views_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "imotidesk_property_views_count"
            referencedColumns: ["property_id"]
          },
        ]
      }
      imotidesk_sell_requests: {
        Row: {
          address: string
          consultation_date: string | null
          created_at: string | null
          description: string | null
          email: string
          id: string
          name: string
          phone: string
          price: number | null
          property_type: string
          status: string | null
          title: string | null
          user_id: string | null
        }
        Insert: {
          address: string
          consultation_date?: string | null
          created_at?: string | null
          description?: string | null
          email: string
          id?: string
          name: string
          phone: string
          price?: number | null
          property_type: string
          status?: string | null
          title?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string
          consultation_date?: string | null
          created_at?: string | null
          description?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string
          price?: number | null
          property_type?: string
          status?: string | null
          title?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      imotidesk_services: {
        Row: {
          created_at: string | null
          description: string
          icon: string
          id: string
          is_highlighted: boolean | null
          name: string
        }
        Insert: {
          created_at?: string | null
          description: string
          icon: string
          id?: string
          is_highlighted?: boolean | null
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string
          icon?: string
          id?: string
          is_highlighted?: boolean | null
          name?: string
        }
        Relationships: []
      }
      imotidesk_slideshow_images: {
        Row: {
          created_at: string | null
          id: string
          image_url: string
          is_active: boolean | null
          order_index: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url: string
          is_active?: boolean | null
          order_index?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string
          is_active?: boolean | null
          order_index?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      imotidesk_social_media_links: {
        Row: {
          created_at: string | null
          display_order: number | null
          icon: string
          id: string
          is_active: boolean | null
          platform: string
          updated_at: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          icon: string
          id?: string
          is_active?: boolean | null
          platform: string
          updated_at?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          icon?: string
          id?: string
          is_active?: boolean | null
          platform?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      imotidesk_team_members: {
        Row: {
          bio: string | null
          created_at: string | null
          email: string | null
          facebook_url: string | null
          id: string
          image_url: string | null
          instagram_url: string | null
          is_active: boolean | null
          name: string
          order_index: number | null
          phone_number: string | null
          position: string
          tiktok_url: string | null
          updated_at: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          email?: string | null
          facebook_url?: string | null
          id?: string
          image_url?: string | null
          instagram_url?: string | null
          is_active?: boolean | null
          name: string
          order_index?: number | null
          phone_number?: string | null
          position: string
          tiktok_url?: string | null
          updated_at?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          email?: string | null
          facebook_url?: string | null
          id?: string
          image_url?: string | null
          instagram_url?: string | null
          is_active?: boolean | null
          name?: string
          order_index?: number | null
          phone_number?: string | null
          position?: string
          tiktok_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      imotidesk_viber_settings: {
        Row: {
          button_text: string | null
          created_at: string | null
          description: string | null
          enabled: boolean | null
          group_link: string
          id: string
          updated_at: string | null
        }
        Insert: {
          button_text?: string | null
          created_at?: string | null
          description?: string | null
          enabled?: boolean | null
          group_link: string
          id?: string
          updated_at?: string | null
        }
        Update: {
          button_text?: string | null
          created_at?: string | null
          description?: string | null
          enabled?: boolean | null
          group_link?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      imotidesk_viewings: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string | null
          name: string
          phone: string
          property_id: string
          status: string | null
          user_id: string | null
          viewing_date: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message?: string | null
          name: string
          phone: string
          property_id: string
          status?: string | null
          user_id?: string | null
          viewing_date: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string | null
          name?: string
          phone?: string
          property_id?: string
          status?: string | null
          user_id?: string | null
          viewing_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "imotidesk_viewings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "imotidesk_properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "imotidesk_viewings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "imotidesk_property_views_count"
            referencedColumns: ["property_id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          quote_id: string | null
          status: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          quote_id?: string | null
          status?: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          quote_id?: string | null
          status?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      team_members: {
        Row: {
          bio: string | null
          created_at: string | null
          email: string | null
          facebook_url: string | null
          id: string | null
          image_url: string | null
          instagram_url: string | null
          is_active: boolean | null
          name: string | null
          order_index: number | null
          phone_number: string | null
          position: string | null
          tiktok_url: string | null
          updated_at: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          email?: string | null
          facebook_url?: string | null
          id?: string | null
          image_url?: string | null
          instagram_url?: string | null
          is_active?: boolean | null
          name?: string | null
          order_index?: number | null
          phone_number?: string | null
          position?: string | null
          tiktok_url?: string | null
          updated_at?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          email?: string | null
          facebook_url?: string | null
          id?: string | null
          image_url?: string | null
          instagram_url?: string | null
          is_active?: boolean | null
          name?: string | null
          order_index?: number | null
          phone_number?: string | null
          position?: string | null
          tiktok_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      imotidesk_blog_views_count: {
        Row: {
          blog_post_id: string | null
          blog_title: string | null
          last_viewed_at: string | null
          view_count: number | null
        }
        Relationships: []
      }
      imotidesk_property_views_count: {
        Row: {
          last_viewed_at: string | null
          property_id: string | null
          property_title: string | null
          view_count: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      imotidesk_create_user_as_admin: {
        Args: {
          admin_user_id: string
          new_user_email: string
          new_user_password: string
          new_user_first_name: string
          new_user_last_name: string
          new_user_role: string
        }
        Returns: Json
      }
      imotidesk_delete_user_as_admin: {
        Args: { admin_user_id: string; user_to_delete_id: string }
        Returns: Json
      }
      imotidesk_get_social_media_links: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          platform: string
          url: string
          icon: string
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }[]
      }
      imotidesk_get_users_with_profiles: {
        Args: { requesting_user_id: string }
        Returns: {
          id: string
          first_name: string
          last_name: string
          role: string
          created_at: string
          email: string
        }[]
      }
      imotidesk_get_viber_settings: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          enabled: boolean
          group_link: string
          button_text: string
          description: string
          created_at: string
          updated_at: string
        }[]
      }
      imotidesk_user_has_role: {
        Args: { requested_role: Database["public"]["Enums"]["app_role"] }
        Returns: boolean
      }
      imotidesk_user_is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      app_role: "public" | "authenticated" | "agent" | "admin"
      user_role: "admin" | "user"
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
    Enums: {
      app_role: ["public", "authenticated", "agent", "admin"],
      user_role: ["admin", "user"],
    },
  },
} as const

// Specific type exports for commonly used tables
export type TeamMember = Tables<'imotidesk_team_members'>
export type Property = Tables<'imotidesk_properties'>
export type BlogPost = Tables<'imotidesk_blog_posts'>
export type Career = Tables<'imotidesk_careers'>
export type Service = Tables<'imotidesk_services'>
export type SocialMediaLink = Tables<'imotidesk_social_media_links'>
export type Profile = Tables<'imotidesk_profiles'>
export type Inquiry = Tables<'imotidesk_inquiries'>
export type SellRequest = Tables<'imotidesk_sell_requests'>
export type Viewing = Tables<'imotidesk_viewings'>
export type SlideshowImage = Tables<'imotidesk_slideshow_images'>
export type ViberSettings = Tables<'imotidesk_viber_settings'>
