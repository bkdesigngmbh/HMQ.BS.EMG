"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { AuftragFormValues } from "@/lib/validations/auftrag";

export async function getAuftraege() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("auftraege")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Fehler beim Laden der Aufträge");
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
    throw new Error("Auftrag nicht gefunden");
  }

  return data;
}

export async function createAuftrag(values: AuftragFormValues) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("auftraege")
    .insert(values)
    .select()
    .single();

  if (error) {
    throw new Error("Fehler beim Erstellen des Auftrags");
  }

  revalidatePath("/auftraege");
  return data;
}

export async function updateAuftrag(id: string, values: AuftragFormValues) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("auftraege")
    .update(values)
    .eq("id", id)
    .select()
    .single();

  if (error) {
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
    throw new Error("Fehler beim Löschen des Auftrags");
  }

  revalidatePath("/auftraege");
}
