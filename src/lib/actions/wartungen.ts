"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  type WartungFormValues,
  transformWartungValues,
} from "@/lib/validations/wartung";

export async function getWartungen() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("wartungen")
    .select(`
      *,
      geraet:geraete(name),
      wartungsart:wartungsarten(*)
    `)
    .order("datum", { ascending: false });

  if (error) {
    console.error("Fehler beim Laden der Wartungen:", error);
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
      geraet:geraete(name),
      wartungsart:wartungsarten(*)
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Wartung nicht gefunden:", error);
    throw new Error("Wartung nicht gefunden");
  }

  return data;
}

export async function createWartung(values: WartungFormValues) {
  const supabase = await createClient();

  const transformedValues = transformWartungValues(values);

  const { data, error } = await supabase
    .from("wartungen")
    .insert(transformedValues)
    .select()
    .single();

  if (error) {
    console.error("Fehler beim Erstellen der Wartung:", error);
    throw new Error("Fehler beim Erstellen der Wartung");
  }

  revalidatePath("/geraete");
  revalidatePath(`/geraete/${values.geraet_id}`);
  return data;
}

export async function updateWartung(id: string, values: WartungFormValues) {
  const supabase = await createClient();

  const transformedValues = transformWartungValues(values);

  const { data, error } = await supabase
    .from("wartungen")
    .update(transformedValues)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Fehler beim Aktualisieren der Wartung:", error);
    throw new Error("Fehler beim Aktualisieren der Wartung");
  }

  revalidatePath("/geraete");
  revalidatePath(`/geraete/${values.geraet_id}`);
  return data;
}

export async function deleteWartung(id: string, geraetId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("wartungen").delete().eq("id", id);

  if (error) {
    console.error("Fehler beim Löschen der Wartung:", error);
    throw new Error("Fehler beim Löschen der Wartung");
  }

  revalidatePath("/geraete");
  revalidatePath(`/geraete/${geraetId}`);
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
    console.error("Fehler beim Laden der Wartungen:", error);
    throw new Error("Fehler beim Laden der Wartungen");
  }

  return data;
}

// Wartungsarten laden
export async function getWartungsarten() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("wartungsarten")
    .select("*")
    .order("sortierung", { ascending: true });

  if (error) {
    console.error("Fehler beim Laden der Wartungsarten:", error);
    throw new Error("Fehler beim Laden der Wartungsarten");
  }

  return data;
}

export async function getWartungsart(id: string) {
  if (!id) return null;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("wartungsarten")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return null;
  }

  return data;
}

// Anstehende Wartungen (Service fällig)
export async function getAnstehendeWartungen() {
  try {
    const supabase = await createClient();

    const heute = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("geraete")
      .select(`
        id,
        name,
        naechster_service,
        status:status(bezeichnung)
      `)
      .not("naechster_service", "is", null)
      .lte("naechster_service", heute)
      .order("naechster_service", { ascending: true });

    if (error) {
      console.error("Fehler beim Laden der anstehenden Wartungen:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Fehler beim Laden der anstehenden Wartungen:", error);
    return [];
  }
}
