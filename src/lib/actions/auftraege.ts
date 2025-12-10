"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  type AuftragFormValues,
  transformAuftragValues,
} from "@/lib/validations/auftrag";

export async function getAuftraege() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("auftraege")
    .select("*")
    .order("auftragsnummer", { ascending: false });

  if (error) {
    console.error("Fehler beim Laden der Aufträge:", error);
    throw new Error("Fehler beim Laden der Aufträge");
  }

  return data;
}

export async function getAktiveAuftraege() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("auftraege")
    .select("*")
    .eq("status", "aktiv")
    .order("auftragsnummer", { ascending: true });

  if (error) {
    console.error("Fehler beim Laden der aktiven Aufträge:", error);
    throw new Error("Fehler beim Laden der aktiven Aufträge");
  }

  return data;
}

export async function getAuftrag(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("auftraege")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Auftrag nicht gefunden:", error);
    throw new Error("Auftrag nicht gefunden");
  }

  return data;
}

export async function getAuftragMitEinsaetze(id: string) {
  const supabase = await createClient();

  // Auftrag laden
  const { data: auftrag, error: auftragError } = await supabase
    .from("auftraege")
    .select("*")
    .eq("id", id)
    .single();

  if (auftragError) {
    console.error("Auftrag nicht gefunden:", auftragError);
    throw new Error("Auftrag nicht gefunden");
  }

  // Einsätze für diesen Auftrag laden
  const { data: einsaetze, error: einsaetzeError } = await supabase
    .from("einsaetze")
    .select(`
      *,
      geraet:geraete(*, status:geraetestatus(*))
    `)
    .eq("auftrag_id", id)
    .order("von_datum", { ascending: false });

  if (einsaetzeError) {
    console.error("Fehler beim Laden der Einsätze:", einsaetzeError);
  }

  return {
    ...auftrag,
    einsaetze: einsaetze || [],
    geraete_anzahl: einsaetze?.filter((e) => !e.bis_effektiv).length || 0,
  };
}

export async function createAuftrag(values: AuftragFormValues) {
  const supabase = await createClient();

  const transformedValues = transformAuftragValues(values);

  const { data, error } = await supabase
    .from("auftraege")
    .insert(transformedValues)
    .select()
    .single();

  if (error) {
    console.error("Fehler beim Erstellen des Auftrags:", error);
    if (error.code === "23505") {
      throw new Error("Ein Auftrag mit dieser Nummer existiert bereits");
    }
    throw new Error("Fehler beim Erstellen des Auftrags");
  }

  revalidatePath("/auftraege");
  return data;
}

export async function updateAuftrag(id: string, values: AuftragFormValues) {
  const supabase = await createClient();

  const transformedValues = transformAuftragValues(values);

  const { data, error } = await supabase
    .from("auftraege")
    .update(transformedValues)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Fehler beim Aktualisieren des Auftrags:", error);
    if (error.code === "23505") {
      throw new Error("Ein Auftrag mit dieser Nummer existiert bereits");
    }
    throw new Error("Fehler beim Aktualisieren des Auftrags");
  }

  revalidatePath("/auftraege");
  revalidatePath(`/auftraege/${id}`);
  return data;
}

export async function deleteAuftrag(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("auftraege").delete().eq("id", id);

  if (error) {
    console.error("Fehler beim Löschen des Auftrags:", error);
    throw new Error("Fehler beim Löschen des Auftrags");
  }

  revalidatePath("/auftraege");
}

// Nächste Auftragsnummer generieren
export async function getNextAuftragsnummer(): Promise<string> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("auftraege")
    .select("auftragsnummer")
    .order("auftragsnummer", { ascending: false })
    .limit(1);

  if (error || !data || data.length === 0) {
    // Wenn keine Aufträge existieren, mit 510001.0001 starten
    return "510001.0001";
  }

  const lastNummer = data[0].auftragsnummer;
  // Format: 51XXXX.XXXX
  const match = lastNummer.match(/^51(\d{4})\.(\d{4})$/);

  if (!match) {
    return "510001.0001";
  }

  const hauptNummer = parseInt(match[1], 10);
  const subNummer = parseInt(match[2], 10);

  // Nächste Nummer generieren
  if (subNummer < 9999) {
    return `51${hauptNummer.toString().padStart(4, "0")}.${(subNummer + 1).toString().padStart(4, "0")}`;
  } else {
    return `51${(hauptNummer + 1).toString().padStart(4, "0")}.0001`;
  }
}
