export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          rolle: "admin" | "user";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          rolle?: "admin" | "user";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          rolle?: "admin" | "user";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      geraete: {
        Row: {
          id: string;
          seriennummer: string;
          geraeteart_id: string | null;
          status_id: string | null;
          standort: string | null;
          bemerkungen: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          seriennummer: string;
          geraeteart_id?: string | null;
          status_id?: string | null;
          standort?: string | null;
          bemerkungen?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          seriennummer?: string;
          geraeteart_id?: string | null;
          status_id?: string | null;
          standort?: string | null;
          bemerkungen?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      geraetearten: {
        Row: {
          id: string;
          name: string;
          beschreibung: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          beschreibung?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          beschreibung?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      geraetestatus: {
        Row: {
          id: string;
          name: string;
          farbe: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          farbe?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          farbe?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      auftraege: {
        Row: {
          id: string;
          auftragsnummer: string;
          kunde: string;
          beschreibung: string | null;
          status: "offen" | "aktiv" | "abgeschlossen";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          auftragsnummer: string;
          kunde: string;
          beschreibung?: string | null;
          status?: "offen" | "aktiv" | "abgeschlossen";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          auftragsnummer?: string;
          kunde?: string;
          beschreibung?: string | null;
          status?: "offen" | "aktiv" | "abgeschlossen";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      einsaetze: {
        Row: {
          id: string;
          geraet_id: string;
          auftrag_id: string;
          standort_adresse: string | null;
          standort_lat: number | null;
          standort_lng: number | null;
          startdatum: string;
          enddatum: string | null;
          bemerkungen: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          geraet_id: string;
          auftrag_id: string;
          standort_adresse?: string | null;
          standort_lat?: number | null;
          standort_lng?: number | null;
          startdatum: string;
          enddatum?: string | null;
          bemerkungen?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          geraet_id?: string;
          auftrag_id?: string;
          standort_adresse?: string | null;
          standort_lat?: number | null;
          standort_lng?: number | null;
          startdatum?: string;
          enddatum?: string | null;
          bemerkungen?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      wartungen: {
        Row: {
          id: string;
          geraet_id: string;
          wartungsart_id: string | null;
          datum: string;
          naechste_wartung: string | null;
          bemerkungen: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          geraet_id: string;
          wartungsart_id?: string | null;
          datum: string;
          naechste_wartung?: string | null;
          bemerkungen?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          geraet_id?: string;
          wartungsart_id?: string | null;
          datum?: string;
          naechste_wartung?: string | null;
          bemerkungen?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      wartungsarten: {
        Row: {
          id: string;
          name: string;
          beschreibung: string | null;
          intervall_monate: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          beschreibung?: string | null;
          intervall_monate?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          beschreibung?: string | null;
          intervall_monate?: number | null;
          created_at?: string;
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
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// Hilfreiche Type-Exports
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Geraet = Database["public"]["Tables"]["geraete"]["Row"];
export type Geraeteart = Database["public"]["Tables"]["geraetearten"]["Row"];
export type Geraetestatus = Database["public"]["Tables"]["geraetestatus"]["Row"];
export type Auftrag = Database["public"]["Tables"]["auftraege"]["Row"];
export type Einsatz = Database["public"]["Tables"]["einsaetze"]["Row"];
export type Wartung = Database["public"]["Tables"]["wartungen"]["Row"];
export type Wartungsart = Database["public"]["Tables"]["wartungsarten"]["Row"];
