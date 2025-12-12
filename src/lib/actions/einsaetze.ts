"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  type EinsatzFormValues,
  type EinsatzBeendenFormValues,
  transformEinsatzValues,
} from "@/lib/validations/einsatz";

export async function getEinsaetze() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("einsaetze")
      .select(`
        *,
        geraet:geraete(*, status:status(*)),
        auftrag:auftraege(*)
      `)
      .order("von", { ascending: false });

    if (error) {
      console.error("Fehler beim Laden der Einsätze:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Fehler beim Laden der Einsätze:", error);
    return [];
  }
}

export async function getEinsatz(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("einsaetze")
    .select(`
      *,
      geraet:geraete(*, status:status(*), geraeteart:geraetearten(*)),
      auftrag:auftraege(*)
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Einsatz nicht gefunden:", error);
    throw new Error("Einsatz nicht gefunden");
  }

  return data;
}

export async function createEinsatz(values: EinsatzFormValues) {
  const supabase = await createClient();

  const transformedValues = transformEinsatzValues(values);

  const { data, error } = await supabase
    .from("einsaetze")
    .insert(transformedValues)
    .select()
    .single();

  if (error) {
    console.error("Fehler beim Erstellen des Einsatzes:", error);
    throw new Error("Fehler beim Erstellen des Einsatzes");
  }

  // Gerätestatus aktualisieren auf "im Einsatz"
  const { data: statusData } = await supabase
    .from("status")
    .select("id")
    .ilike("bezeichnung", "im einsatz")
    .single();

  if (statusData) {
    await supabase
      .from("geraete")
      .update({ status_id: statusData.id })
      .eq("id", values.geraet_id);
  }

  revalidatePath("/einsaetze");
  revalidatePath("/geraete");
  revalidatePath("/karte");
  revalidatePath("/");
  return data;
}

export async function updateEinsatz(id: string, values: EinsatzFormValues) {
  const supabase = await createClient();

  const transformedValues = transformEinsatzValues(values);

  const { data, error } = await supabase
    .from("einsaetze")
    .update(transformedValues)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Fehler beim Aktualisieren des Einsatzes:", error);
    throw new Error("Fehler beim Aktualisieren des Einsatzes");
  }

  revalidatePath("/einsaetze");
  revalidatePath("/karte");
  return data;
}

export async function beendenEinsatz(
  id: string,
  values: EinsatzBeendenFormValues,
  geraetId: string
) {
  const supabase = await createClient();

  // Einsatz beenden
  const { data, error } = await supabase
    .from("einsaetze")
    .update({ bis_effektiv: values.bis_effektiv })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Fehler beim Beenden des Einsatzes:", error);
    throw new Error("Fehler beim Beenden des Einsatzes");
  }

  // Gerätestatus aktualisieren
  const { error: statusError } = await supabase
    .from("geraete")
    .update({ status_id: values.neuer_status_id })
    .eq("id", geraetId);

  if (statusError) {
    console.error("Fehler beim Aktualisieren des Gerätestatus:", statusError);
    throw new Error("Fehler beim Aktualisieren des Gerätestatus");
  }

  revalidatePath("/einsaetze");
  revalidatePath("/geraete");
  revalidatePath("/karte");
  revalidatePath("/");
  return data;
}

export async function deleteEinsatz(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("einsaetze").delete().eq("id", id);

  if (error) {
    console.error("Fehler beim Löschen des Einsatzes:", error);
    throw new Error("Fehler beim Löschen des Einsatzes");
  }

  revalidatePath("/einsaetze");
  revalidatePath("/karte");
}

export async function getAktiveEinsaetze() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("einsaetze")
      .select(`
        *,
        geraet:geraete(*, status:status(*)),
        auftrag:auftraege(*)
      `)
      .is("bis_effektiv", null)
      .order("von", { ascending: false });

    if (error) {
      console.error("Fehler beim Laden der aktiven Einsätze:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Fehler beim Laden der aktiven Einsätze:", error);
    return [];
  }
}

export async function getEinsaetzeByGeraet(geraetId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("einsaetze")
    .select(`
      *,
      auftrag:auftraege(*)
    `)
    .eq("geraet_id", geraetId)
    .order("von", { ascending: false });

  if (error) {
    console.error("Fehler beim Laden der Einsätze:", error);
    throw new Error("Fehler beim Laden der Einsätze");
  }

  return data;
}

export async function getEinsaetzeByAuftrag(auftragId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("einsaetze")
    .select(`
      *,
      geraet:geraete(*, status:status(*))
    `)
    .eq("auftrag_id", auftragId)
    .order("von", { ascending: false });

  if (error) {
    console.error("Fehler beim Laden der Einsätze:", error);
    throw new Error("Fehler beim Laden der Einsätze");
  }

  return data;
}

// ============================================
// Drag&Drop Board Funktionen
// ============================================

interface CreateEinsatzFromBoardData {
  geraet_id: string;
  auftrag_id: string;
  von: string;
  bis_provisorisch?: string | null;
  strasse?: string | null;
  plz?: string | null;
  ort?: string | null;
  koordinaten_lat?: number | null;
  koordinaten_lng?: number | null;
  notizen?: string | null;
}

export async function createEinsatzFromBoard(
  data: CreateEinsatzFromBoardData,
  imEinsatzStatusId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  try {
    // 1. Einsatz erstellen
    const { error: einsatzError } = await supabase.from("einsaetze").insert({
      geraet_id: data.geraet_id,
      auftrag_id: data.auftrag_id,
      von: data.von,
      bis_provisorisch: data.bis_provisorisch || null,
      strasse: data.strasse || null,
      plz: data.plz || null,
      ort: data.ort || null,
      koordinaten_lat: data.koordinaten_lat || null,
      koordinaten_lng: data.koordinaten_lng || null,
      notizen: data.notizen || null,
    });

    if (einsatzError) {
      console.error("Fehler beim Erstellen des Einsatzes:", einsatzError);
      return { success: false, error: einsatzError.message };
    }

    // 2. Gerät-Status auf "Im Einsatz" setzen
    const { error: statusError } = await supabase
      .from("geraete")
      .update({ status_id: imEinsatzStatusId })
      .eq("id", data.geraet_id);

    if (statusError) {
      console.error("Fehler beim Aktualisieren des Gerät-Status:", statusError);
      return { success: false, error: statusError.message };
    }

    // 3. Seiten revalidieren
    revalidatePath("/");
    revalidatePath("/geraete");
    revalidatePath("/auftraege");
    revalidatePath("/karte");
    revalidatePath("/einsaetze");

    return { success: true };
  } catch (error) {
    console.error("createEinsatzFromBoard Fehler:", error);
    return { success: false, error: String(error) };
  }
}

export async function beendeEinsatzFromBoard(
  einsatzId: string,
  neuerStatusId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  try {
    // 1. Einsatz laden um geraet_id zu bekommen
    const { data: einsatz, error: loadError } = await supabase
      .from("einsaetze")
      .select("geraet_id")
      .eq("id", einsatzId)
      .single();

    if (loadError || !einsatz) {
      return { success: false, error: "Einsatz nicht gefunden" };
    }

    // 2. Einsatz beenden (bis_effektiv setzen)
    const heute = new Date().toISOString().split("T")[0];
    const { error: updateError } = await supabase
      .from("einsaetze")
      .update({ bis_effektiv: heute })
      .eq("id", einsatzId);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    // 3. Gerät-Status aktualisieren
    const { error: statusError } = await supabase
      .from("geraete")
      .update({ status_id: neuerStatusId })
      .eq("id", einsatz.geraet_id);

    if (statusError) {
      return { success: false, error: statusError.message };
    }

    // 4. Seiten revalidieren
    revalidatePath("/");
    revalidatePath("/geraete");
    revalidatePath("/auftraege");
    revalidatePath("/karte");
    revalidatePath("/einsaetze");

    return { success: true };
  } catch (error) {
    console.error("beendeEinsatzFromBoard Fehler:", error);
    return { success: false, error: String(error) };
  }
}

// Geocoding Funktion (Nominatim OpenStreetMap)
export async function geocodeAddress(
  strasse: string,
  plz: string,
  ort: string
): Promise<{ lat: number; lng: number } | null> {
  try {
    const query = encodeURIComponent(`${strasse}, ${plz} ${ort}, Schweiz`);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}&countrycodes=ch&limit=1`,
      {
        headers: {
          "User-Agent": "HMQ-EMG-App/1.0",
        },
      }
    );

    const data = await response.json();

    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    }
    return null;
  } catch (error) {
    console.error("Geocoding Fehler:", error);
    return null;
  }
}
