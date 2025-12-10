"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { GeraetFormValues } from "@/lib/validations/geraet";

export async function getGeraete() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("geraete")
    .select(`
      *,
      geraeteart:geraetearten(*),
      status:geraetestatus(*)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Fehler beim Laden der Geräte");
  }

  return data;
}

export async function getGeraet(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("geraete")
    .select(`
      *,
      geraeteart:geraetearten(*),
      status:geraetestatus(*)
    `)
    .eq("id", id)
    .single();

  if (error) {
    throw new Error("Gerät nicht gefunden");
  }

  return data;
}

export async function createGeraet(values: GeraetFormValues) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("geraete")
    .insert(values)
    .select()
    .single();

  if (error) {
    throw new Error("Fehler beim Erstellen des Geräts");
  }

  revalidatePath("/geraete");
  return data;
}

export async function updateGeraet(id: string, values: GeraetFormValues) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("geraete")
    .update(values)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error("Fehler beim Aktualisieren des Geräts");
  }

  revalidatePath("/geraete");
  revalidatePath(`/geraete/${id}`);
  return data;
}

export async function deleteGeraet(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("geraete").delete().eq("id", id);

  if (error) {
    throw new Error("Fehler beim Löschen des Geräts");
  }

  revalidatePath("/geraete");
}
