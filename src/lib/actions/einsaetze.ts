"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { EinsatzFormValues } from "@/lib/validations/einsatz";

export async function getEinsaetze() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("einsaetze")
    .select(`
      *,
      geraet:geraete(*),
      auftrag:auftraege(*)
    `)
    .order("startdatum", { ascending: false });

  if (error) {
    throw new Error("Fehler beim Laden der Einsätze");
  }

  return data;
}

export async function getEinsatz(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("einsaetze")
    .select(`
      *,
      geraet:geraete(*),
      auftrag:auftraege(*)
    `)
    .eq("id", id)
    .single();

  if (error) {
    throw new Error("Einsatz nicht gefunden");
  }

  return data;
}

export async function createEinsatz(values: EinsatzFormValues) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("einsaetze")
    .insert(values)
    .select()
    .single();

  if (error) {
    throw new Error("Fehler beim Erstellen des Einsatzes");
  }

  revalidatePath("/einsaetze");
  revalidatePath("/karte");
  return data;
}

export async function updateEinsatz(id: string, values: EinsatzFormValues) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("einsaetze")
    .update(values)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error("Fehler beim Aktualisieren des Einsatzes");
  }

  revalidatePath("/einsaetze");
  revalidatePath("/karte");
  return data;
}

export async function deleteEinsatz(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("einsaetze").delete().eq("id", id);

  if (error) {
    throw new Error("Fehler beim Löschen des Einsatzes");
  }

  revalidatePath("/einsaetze");
  revalidatePath("/karte");
}

export async function getAktiveEinsaetze() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("einsaetze")
    .select(`
      *,
      geraet:geraete(*),
      auftrag:auftraege(*)
    `)
    .is("enddatum", null)
    .order("startdatum", { ascending: false });

  if (error) {
    throw new Error("Fehler beim Laden der aktiven Einsätze");
  }

  return data;
}
