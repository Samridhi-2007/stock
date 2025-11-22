export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5";
  };
  public: {
    Tables: {
      adjustment_lines: {
        Row: {
          adjustment_id: string | null;
          counted_quantity: number;
          created_at: string | null;
          difference: number | null;
          id: string;
          product_id: string | null;
          system_quantity: number;
        };
        Insert: {
          adjustment_id?: string | null;
          counted_quantity: number;
          created_at?: string | null;
          difference?: number | null;
          id?: string;
          product_id?: string | null;
          system_quantity: number;
        };
        Update: {
          adjustment_id?: string | null;
          counted_quantity?: number;
          created_at?: string | null;
          difference?: number | null;
          id?: string;
          product_id?: string | null;
          system_quantity?: number;
        };
        Relationships: [
          {
            foreignKeyName: "adjustment_lines_adjustment_id_fkey";
            columns: ["adjustment_id"];
            isOneToOne: false;
            referencedRelation: "adjustments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "adjustment_lines_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          }
        ];
      };
      adjustments: {
        Row: {
          adjustment_date: string | null;
          adjustment_number: string;
          created_at: string | null;
          created_by: string | null;
          id: string;
          reason: string | null;
          status: Database["public"]["Enums"]["document_status"] | null;
          updated_at: string | null;
          warehouse_id: string | null;
        };
        Insert: {
          adjustment_date?: string | null;
          adjustment_number: string;
          created_at?: string | null;
          created_by?: string | null;
          id?: string;
          reason?: string | null;
          status?: Database["public"]["Enums"]["document_status"] | null;
          updated_at?: string | null;
          warehouse_id?: string | null;
        };
        Update: {
          adjustment_date?: string | null;
          adjustment_number?: string;
          created_at?: string | null;
          created_by?: string | null;
          id?: string;
          reason?: string | null;
          status?: Database["public"]["Enums"]["document_status"] | null;
          updated_at?: string | null;
          warehouse_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "adjustments_warehouse_id_fkey";
            columns: ["warehouse_id"];
            isOneToOne: false;
            referencedRelation: "warehouses";
            referencedColumns: ["id"];
          }
        ];
      };
      deliveries: {
        Row: {
          created_at: string | null;
          created_by: string | null;
          customer_name: string;
          delivery_date: string | null;
          delivery_number: string;
          id: string;
          notes: string | null;
          status: Database["public"]["Enums"]["document_status"] | null;
          updated_at: string | null;
          warehouse_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          created_by?: string | null;
          customer_name: string;
          delivery_date?: string | null;
          delivery_number: string;
          id?: string;
          notes?: string | null;
          status?: Database["public"]["Enums"]["document_status"] | null;
          updated_at?: string | null;
          warehouse_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          created_by?: string | null;
          customer_name?: string;
          delivery_date?: string | null;
          delivery_number?: string;
          id?: string;
          notes?: string | null;
          status?: Database["public"]["Enums"]["document_status"] | null;
          updated_at?: string | null;
          warehouse_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "deliveries_warehouse_id_fkey";
            columns: ["warehouse_id"];
            isOneToOne: false;
            referencedRelation: "warehouses";
            referencedColumns: ["id"];
          }
        ];
      };
      delivery_lines: {
        Row: {
          created_at: string | null;
          delivery_id: string | null;
          id: string;
          product_id: string | null;
          quantity: number;
        };
        Insert: {
          created_at?: string | null;
          delivery_id?: string | null;
          id?: string;
          product_id?: string | null;
          quantity: number;
        };
        Update: {
          created_at?: string | null;
          delivery_id?: string | null;
          id?: string;
          product_id?: string | null;
          quantity?: number;
        };
        Relationships: [
          {
            foreignKeyName: "delivery_lines_delivery_id_fkey";
            columns: ["delivery_id"];
            isOneToOne: false;
            referencedRelation: "deliveries";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "delivery_lines_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          }
        ];
      };
      product_categories: {
        Row: {
          created_at: string | null;
          description: string | null;
          id: string;
          name: string;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          name: string;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          category_id: string | null;
          created_at: string | null;
          current_stock: number | null;
          description: string | null;
          id: string;
          name: string;
          reorder_level: number | null;
          sku: string;
          unit_of_measure: string;
          updated_at: string | null;
        };
        Insert: {
          category_id?: string | null;
          created_at?: string | null;
          current_stock?: number | null;
          description?: string | null;
          id?: string;
          name: string;
          reorder_level?: number | null;
          sku: string;
          unit_of_measure: string;
          updated_at?: string | null;
        };
        Update: {
          category_id?: string | null;
          created_at?: string | null;
          current_stock?: number | null;
          description?: string | null;
          id?: string;
          name?: string;
          reorder_level?: number | null;
          sku?: string;
          unit_of_measure?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "product_categories";
            referencedColumns: ["id"];
          }
        ];
      };
      profiles: {
        Row: {
          created_at: string | null;
          email: string | null;
          full_name: string | null;
          id: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          email?: string | null;
          full_name?: string | null;
          id: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      receipt_lines: {
        Row: {
          created_at: string | null;
          id: string;
          product_id: string | null;
          quantity: number;
          receipt_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          product_id?: string | null;
          quantity: number;
          receipt_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          product_id?: string | null;
          quantity?: number;
          receipt_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "receipt_lines_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "receipt_lines_receipt_id_fkey";
            columns: ["receipt_id"];
            isOneToOne: false;
            referencedRelation: "receipts";
            referencedColumns: ["id"];
          }
        ];
      };
      receipts: {
        Row: {
          created_at: string | null;
          created_by: string | null;
          id: string;
          notes: string | null;
          receipt_date: string | null;
          receipt_number: string;
          status: Database["public"]["Enums"]["document_status"] | null;
          supplier_name: string;
          updated_at: string | null;
          warehouse_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          created_by?: string | null;
          id?: string;
          notes?: string | null;
          receipt_date?: string | null;
          receipt_number: string;
          status?: Database["public"]["Enums"]["document_status"] | null;
          supplier_name: string;
          updated_at?: string | null;
          warehouse_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          created_by?: string | null;
          id?: string;
          notes?: string | null;
          receipt_date?: string | null;
          receipt_number?: string;
          status?: Database["public"]["Enums"]["document_status"] | null;
          supplier_name?: string;
          updated_at?: string | null;
          warehouse_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "receipts_warehouse_id_fkey";
            columns: ["warehouse_id"];
            isOneToOne: false;
            referencedRelation: "warehouses";
            referencedColumns: ["id"];
          }
        ];
      };
      stock_moves: {
        Row: {
          created_by: string | null;
          id: string;
          move_date: string | null;
          move_type: Database["public"]["Enums"]["stock_move_type"];
          notes: string | null;
          product_id: string | null;
          quantity: number;
          reference_id: string | null;
          reference_number: string | null;
          warehouse_id: string | null;
        };
        Insert: {
          created_by?: string | null;
          id?: string;
          move_date?: string | null;
          move_type: Database["public"]["Enums"]["stock_move_type"];
          notes?: string | null;
          product_id?: string | null;
          quantity: number;
          reference_id?: string | null;
          reference_number?: string | null;
          warehouse_id?: string | null;
        };
        Update: {
          created_by?: string | null;
          id?: string;
          move_date?: string | null;
          move_type?: Database["public"]["Enums"]["stock_move_type"];
          notes?: string | null;
          product_id?: string | null;
          quantity?: number;
          reference_id?: string | null;
          reference_number?: string | null;
          warehouse_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "stock_moves_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "stock_moves_warehouse_id_fkey";
            columns: ["warehouse_id"];
            isOneToOne: false;
            referencedRelation: "warehouses";
            referencedColumns: ["id"];
          }
        ];
      };
      transfer_lines: {
        Row: {
          created_at: string | null;
          id: string;
          product_id: string | null;
          quantity: number;
          transfer_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          product_id?: string | null;
          quantity: number;
          transfer_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          product_id?: string | null;
          quantity?: number;
          transfer_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "transfer_lines_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "transfer_lines_transfer_id_fkey";
            columns: ["transfer_id"];
            isOneToOne: false;
            referencedRelation: "transfers";
            referencedColumns: ["id"];
          }
        ];
      };
      transfers: {
        Row: {
          created_at: string | null;
          created_by: string | null;
          from_warehouse_id: string | null;
          id: string;
          notes: string | null;
          status: Database["public"]["Enums"]["document_status"] | null;
          to_warehouse_id: string | null;
          transfer_date: string | null;
          transfer_number: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          created_by?: string | null;
          from_warehouse_id?: string | null;
          id?: string;
          notes?: string | null;
          status?: Database["public"]["Enums"]["document_status"] | null;
          to_warehouse_id?: string | null;
          transfer_date?: string | null;
          transfer_number: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          created_by?: string | null;
          from_warehouse_id?: string | null;
          id?: string;
          notes?: string | null;
          status?: Database["public"]["Enums"]["document_status"] | null;
          to_warehouse_id?: string | null;
          transfer_date?: string | null;
          transfer_number?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "transfers_from_warehouse_id_fkey";
            columns: ["from_warehouse_id"];
            isOneToOne: false;
            referencedRelation: "warehouses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "transfers_to_warehouse_id_fkey";
            columns: ["to_warehouse_id"];
            isOneToOne: false;
            referencedRelation: "warehouses";
            referencedColumns: ["id"];
          }
        ];
      };
      warehouses: {
        Row: {
          address: string | null;
          code: string;
          created_at: string | null;
          id: string;
          is_active: boolean | null;
          name: string;
          updated_at: string | null;
        };
        Insert: {
          address?: string | null;
          code: string;
          created_at?: string | null;
          id?: string;
          is_active?: boolean | null;
          name: string;
          updated_at?: string | null;
        };
        Update: {
          address?: string | null;
          code?: string;
          created_at?: string | null;
          id?: string;
          is_active?: boolean | null;
          name?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      document_status: "draft" | "waiting" | "ready" | "done" | "canceled";
      stock_move_type: "receipt" | "delivery" | "transfer" | "adjustment";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {
      document_status: ["draft", "waiting", "ready", "done", "canceled"],
      stock_move_type: ["receipt", "delivery", "transfer", "adjustment"],
    },
  },
} as const;
