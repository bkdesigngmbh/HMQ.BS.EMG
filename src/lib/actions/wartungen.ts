"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { WartungFormValues } from "@/lib/validations/wartung";

export async function getWartungen() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("wartungen")
    .select(`
      *,
      geraet:geraete(*),
      wartungsart:wartungsarten(*)
    `)
    .order("datum", { ascending: false });

  if (error) {
    throw new Error("Fehler beim Laden der Wartungen");
  }

  return data;
}

export async function getWartung(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("wartungen")
    .select(`
      *,
      geraet:geraete(*),
      wartungsart:wartungsarten(*)
    `)
    .eq("id", id)
    .single();

  if (error) {
    throw new Error("Wartung nicht gefunden");
  }

  return data;
}

export async function createWartung(values: WartungFormValues) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("wartungen")
    .insert(values)
    .select()
    .single();

  if (error) {
    throw new Error("Fehler beim Erstellen der Wartung");
  }

  revalidatePath("/geraete");
  return data;
}

export async function updateWartung(id: string, values: WartungFormValues) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("wartungen")
    .update(values)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error("Fehler beim Aktualisieren der Wartung");
  }

  revalidatePath("/geraete");
  return data;
}

export async function deleteWartung(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("wartungen").delete().eq("id", id);

  if (error) {
    throw new Error("Fehler beim Löschen der Wartung");
  }

  revalidatePath("/geraete");
}

export async function getWartungenByGeraet(geraetId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("wartungen")
    .select(`
      *,
      wartungsart:wartungsarten(*)
    `)
    .eq("geraet_id", geraetId)
    .order("datum", { ascending: false });

  if (error) {
    throw new Error("Fehler beim Laden der Wartungen");
  }

  return data;
}
