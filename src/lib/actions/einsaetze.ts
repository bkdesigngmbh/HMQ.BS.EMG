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
    .eq("bezeichnung", "im Einsatz")
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
