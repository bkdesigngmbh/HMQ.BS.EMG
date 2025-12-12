"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  type GeraetFormValues,
  transformGeraetValues,
} from "@/lib/validations/geraet";

export async function getGeraete() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("geraete")
      .select(`
        *,
        geraeteart:geraetearten(*),
        status:status(*)
      `)
      .order("name", { ascending: true });

    if (error) {
      console.error("Fehler beim Laden der Geräte:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Fehler beim Laden der Geräte:", error);
    return [];
  }
}

export async function getGeraet(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("geraete")
    .select(`
      *,
      geraeteart:geraetearten(*),
      status:status(*)
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Gerät nicht gefunden:", error);
    throw new Error("Gerät nicht gefunden");
  }

  return data;
}

export async function getGeraetMitAktiverEinsatz(id: string) {
  const supabase = await createClient();

  // Gerät laden
  const { data: geraet, error: geraetError } = await supabase
    .from("geraete")
    .select(`
      *,
      geraeteart:geraetearten(*),
      status:status(*)
    `)
    .eq("id", id)
    .single();

  if (geraetError) {
    console.error("Gerät nicht gefunden:", geraetError);
    throw new Error("Gerät nicht gefunden");
  }

  // Aktiven Einsatz laden (falls vorhanden)
  const { data: einsatz } = await supabase
    .from("einsaetze")
    .select(`
      *,
      auftrag:auftraege(*)
    `)
    .eq("geraet_id", id)
    .is("bis_effektiv", null)
    .single();

  return {
    ...geraet,
    aktiver_einsatz: einsatz || null,
  };
}

export async function createGeraet(values: GeraetFormValues) {
  const supabase = await createClient();

  const transformedValues = transformGeraetValues(values);

  const { data, error } = await supabase
    .from("geraete")
    .insert(transformedValues)
    .select()
    .single();

  if (error) {
    console.error("Fehler beim Erstellen des Geräts:", error);
    if (error.code === "23505") {
      throw new Error("Ein Gerät mit diesem Namen existiert bereits");
    }
    throw new Error("Fehler beim Erstellen des Geräts");
  }

  revalidatePath("/geraete");
  revalidatePath("/");
  return data;
}

export async function updateGeraet(id: string, values: GeraetFormValues) {
  const supabase = await createClient();

  const transformedValues = transformGeraetValues(values);

  const { data, error } = await supabase
    .from("geraete")
    .update(transformedValues)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Fehler beim Aktualisieren des Geräts:", error);
    if (error.code === "23505") {
      throw new Error("Ein Gerät mit diesem Namen existiert bereits");
    }
    throw new Error("Fehler beim Aktualisieren des Geräts");
  }

  revalidatePath("/geraete");
  revalidatePath(`/geraete/${id}`);
  revalidatePath("/");
  return data;
}

export async function deleteGeraet(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("geraete").delete().eq("id", id);

  if (error) {
    console.error("Fehler beim Löschen des Geräts:", error);
    throw new Error("Fehler beim Löschen des Geräts");
  }

  revalidatePath("/geraete");
  revalidatePath("/");
}

// Geräte nach Status filtern
export async function getGeraeteByStatus(statusName: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("geraete")
    .select(`
      *,
      geraeteart:geraetearten(*),
      status:status!inner(*)
    `)
    .eq("status.bezeichnung", statusName)
    .order("name", { ascending: true });

  if (error) {
    console.error("Fehler beim Laden der Geräte:", error);
    throw new Error("Fehler beim Laden der Geräte");
  }

  return data;
}

// Verfügbare Geräte für neuen Einsatz
export async function getVerfuegbareGeraete() {
  try {
    const supabase = await createClient();

    // Erst Status-ID für "Im Büro" holen (case-insensitive)
    const { data: statusData } = await supabase
      .from("status")
      .select("id")
      .ilike("bezeichnung", "im büro")
      .single();

    if (!statusData) {
      console.error("Status 'Im Büro' nicht gefunden");
      return [];
    }

    // Geräte mit diesem Status laden
    const { data, error } = await supabase
      .from("geraete")
      .select(`
        *,
        geraeteart:geraetearten(*),
        status:status(*)
      `)
      .eq("status_id", statusData.id)
      .order("name", { ascending: true });

    if (error) {
      console.error("Fehler beim Laden der verfügbaren Geräte:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Fehler beim Laden der verfügbaren Geräte:", error);
    return [];
  }
}

// Stammdaten laden
export async function getGeraetearten() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("geraetearten")
      .select("*")
      .order("sortierung", { ascending: true });

    if (error) {
      console.error("Fehler beim Laden der Gerätearten:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Fehler beim Laden der Gerätearten:", error);
    return [];
  }
}

export async function getGeraetestatus() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("status")
      .select("*")
      .order("sortierung", { ascending: true });

    if (error) {
      console.error("Fehler beim Laden der Status:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Fehler beim Laden der Status:", error);
    return [];
  }
}

// Status-ID für "Im Einsatz" holen
export async function getImEinsatzStatusId(): Promise<string | null> {
  try {
    const supabase = await createClient();

    const { data } = await supabase
      .from("status")
      .select("id")
      .ilike("bezeichnung", "im einsatz")
      .single();

    return data?.id || null;
  } catch (error) {
    console.error("Fehler beim Laden des Status:", error);
    return null;
  }
}

// Dashboard-Statistiken
export async function getGeraeteStatistiken() {
  const defaultStatistiken = {
    gesamt: 0,
    imBuero: 0,
    imEinsatz: 0,
    inWartung: 0,
    defekt: 0,
  };

  try {
    const supabase = await createClient();

    // Alle Geräte mit Status laden
    const { data: geraete, error } = await supabase
      .from("geraete")
      .select(`
        id,
        status:status(bezeichnung)
      `);

    if (error) {
      console.error("Fehler beim Laden der Statistiken:", error);
      return defaultStatistiken;
    }

    const statistiken = {
      gesamt: geraete?.length || 0,
      imBuero: 0,
      imEinsatz: 0,
      inWartung: 0,
      defekt: 0,
    };

    geraete?.forEach((g) => {
      const statusName = (g.status as unknown as { bezeichnung: string } | null)?.bezeichnung;
      switch (statusName) {
        case "im Büro":
          statistiken.imBuero++;
          break;
        case "im Einsatz":
          statistiken.imEinsatz++;
          break;
        case "in Wartung":
          statistiken.inWartung++;
          break;
        case "defekt":
          statistiken.defekt++;
          break;
      }
    });

    return statistiken;
  } catch (error) {
    console.error("Fehler beim Laden der Statistiken:", error);
    return defaultStatistiken;
  }
}
