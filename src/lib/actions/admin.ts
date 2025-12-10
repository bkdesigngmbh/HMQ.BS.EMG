"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// Gerätestatus

export async function getGeraetestatus() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("geraetestatus")
    .select("*")
    .order("name");

  if (error) {
    throw new Error("Fehler beim Laden der Status");
  }

  return data;
}

export async function createGeraetestatus(values: { name: string; farbe: string }) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("geraetestatus")
    .insert(values)
    .select()
    .single();

  if (error) {
    throw new Error("Fehler beim Erstellen des Status");
  }

  revalidatePath("/admin/status");
  return data;
}

export async function deleteGeraetestatus(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("geraetestatus").delete().eq("id", id);

  if (error) {
    throw new Error("Fehler beim Löschen des Status");
  }

  revalidatePath("/admin/status");
}

// Gerätearten

export async function getGeraetearten() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("geraetearten")
    .select("*")
    .order("name");

  if (error) {
    throw new Error("Fehler beim Laden der Gerätearten");
  }

  return data;
}

export async function createGeraeteart(values: { name: string; beschreibung?: string }) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("geraetearten")
    .insert(values)
    .select()
    .single();

  if (error) {
    throw new Error("Fehler beim Erstellen der Geräteart");
  }

  revalidatePath("/admin/geraetearten");
  return data;
}

export async function deleteGeraeteart(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("geraetearten").delete().eq("id", id);

  if (error) {
    throw new Error("Fehler beim Löschen der Geräteart");
  }

  revalidatePath("/admin/geraetearten");
}

// Wartungsarten

export async function getWartungsarten() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("wartungsarten")
    .select("*")
    .order("name");

  if (error) {
    throw new Error("Fehler beim Laden der Wartungsarten");
  }

  return data;
}

export async function createWartungsart(values: {
  name: string;
  beschreibung?: string;
  intervall_monate?: number;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("wartungsarten")
    .insert(values)
    .select()
    .single();

  if (error) {
    throw new Error("Fehler beim Erstellen der Wartungsart");
  }

  revalidatePath("/admin/wartungsarten");
  return data;
}

export async function deleteWartungsart(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("wartungsarten").delete().eq("id", id);

  if (error) {
    throw new Error("Fehler beim Löschen der Wartungsart");
  }

  revalidatePath("/admin/wartungsarten");
}

// Benutzer

export async function getBenutzer() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("email");

  if (error) {
    throw new Error("Fehler beim Laden der Benutzer");
  }

  return data;
}

export async function updateBenutzerRolle(id: string, rolle: "admin" | "user") {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .update({ rolle })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error("Fehler beim Aktualisieren der Benutzerrolle");
  }

  revalidatePath("/admin/benutzer");
  return data;
}
