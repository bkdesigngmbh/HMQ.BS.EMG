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
        Relationships: [];
      };
      geraete: {
        Row: {
          id: string;
          name: string;
          eigentum: "eigen" | "miete";
          seriennummer: string;
          client: string | null;
          ip_adresse: string | null;
          pin: string | null;
          geraeteart_id: string | null;
          status_id: string | null;
          kaufdatum: string | null;
          naechster_service: string | null;
          notizen: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          eigentum: "eigen" | "miete";
          seriennummer: string;
          client?: string | null;
          ip_adresse?: string | null;
          pin?: string | null;
          geraeteart_id?: string | null;
          status_id?: string | null;
          kaufdatum?: string | null;
          naechster_service?: string | null;
          notizen?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          eigentum?: "eigen" | "miete";
          seriennummer?: string;
          client?: string | null;
          ip_adresse?: string | null;
          pin?: string | null;
          geraeteart_id?: string | null;
          status_id?: string | null;
          kaufdatum?: string | null;
          naechster_service?: string | null;
          notizen?: string | null;
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
          auftragsort: string | null;
          bezeichnung: string | null;
          status: "aktiv" | "inaktiv";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          auftragsnummer: string;
          auftragsort?: string | null;
          bezeichnung?: string | null;
          status?: "aktiv" | "inaktiv";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          auftragsnummer?: string;
          auftragsort?: string | null;
          bezeichnung?: string | null;
          status?: "aktiv" | "inaktiv";
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
          von_datum: string;
          bis_provisorisch: string | null;
          bis_effektiv: string | null;
          strasse: string | null;
          plz: string | null;
          ort: string | null;
          lat: number | null;
          lng: number | null;
          notizen: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          geraet_id: string;
          auftrag_id: string;
          von_datum: string;
          bis_provisorisch?: string | null;
          bis_effektiv?: string | null;
          strasse?: string | null;
          plz?: string | null;
          ort?: string | null;
          lat?: number | null;
          lng?: number | null;
          notizen?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          geraet_id?: string;
          auftrag_id?: string;
          von_datum?: string;
          bis_provisorisch?: string | null;
          bis_effektiv?: string | null;
          strasse?: string | null;
          plz?: string | null;
          ort?: string | null;
          lat?: number | null;
          lng?: number | null;
          notizen?: string | null;
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
          durchgefuehrt_von: string | null;
          notizen: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          geraet_id: string;
          wartungsart_id?: string | null;
          datum: string;
          durchgefuehrt_von?: string | null;
          notizen?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          geraet_id?: string;
          wartungsart_id?: string | null;
          datum?: string;
          durchgefuehrt_von?: string | null;
          notizen?: string | null;
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
export type GeraetInsert = Database["public"]["Tables"]["geraete"]["Insert"];
export type GeraetUpdate = Database["public"]["Tables"]["geraete"]["Update"];
export type Geraeteart = Database["public"]["Tables"]["geraetearten"]["Row"];
export type Geraetestatus = Database["public"]["Tables"]["geraetestatus"]["Row"];
export type Auftrag = Database["public"]["Tables"]["auftraege"]["Row"];
export type AuftragInsert = Database["public"]["Tables"]["auftraege"]["Insert"];
export type AuftragUpdate = Database["public"]["Tables"]["auftraege"]["Update"];
export type Einsatz = Database["public"]["Tables"]["einsaetze"]["Row"];
export type EinsatzInsert = Database["public"]["Tables"]["einsaetze"]["Insert"];
export type EinsatzUpdate = Database["public"]["Tables"]["einsaetze"]["Update"];
export type Wartung = Database["public"]["Tables"]["wartungen"]["Row"];
export type WartungInsert = Database["public"]["Tables"]["wartungen"]["Insert"];
export type Wartungsart = Database["public"]["Tables"]["wartungsarten"]["Row"];

// Erweiterte Types mit Relationen
export type GeraetMitRelationen = Geraet & {
  geraeteart: Geraeteart | null;
  status: Geraetestatus | null;
  aktiver_einsatz?: (Einsatz & { auftrag: Auftrag }) | null;
};

export type EinsatzMitRelationen = Einsatz & {
  geraet: Geraet;
  auftrag: Auftrag;
};

export type AuftragMitRelationen = Auftrag & {
  einsaetze?: EinsatzMitRelationen[];
  geraete_anzahl?: number;
};

export type WartungMitRelationen = Wartung & {
  wartungsart: Wartungsart | null;
};
