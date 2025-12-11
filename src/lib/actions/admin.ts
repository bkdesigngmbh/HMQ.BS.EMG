"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// =====================
// Gerätestatus
// =====================

export async function getGeraetestatus() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("status")
    .select("*")
    .order("sortierung");

  if (error) {
    throw new Error("Fehler beim Laden der Status");
  }

  return data;
}

export async function createGeraetestatus(values: { bezeichnung: string; farbe: string }) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("status")
    .insert(values)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("Ein Status mit dieser Bezeichnung existiert bereits");
    }
    throw new Error("Fehler beim Erstellen des Status");
  }

  revalidatePath("/admin/status");
  revalidatePath("/geraete");
  return data;
}

export async function updateGeraetestatus(id: string, values: { bezeichnung: string; farbe: string }) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("status")
    .update(values)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("Ein Status mit dieser Bezeichnung existiert bereits");
    }
    throw new Error("Fehler beim Aktualisieren des Status");
  }

  revalidatePath("/admin/status");
  revalidatePath("/geraete");
  return data;
}

export async function getStatusUsageCount(id: string) {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("geraete")
    .select("*", { count: "exact", head: true })
    .eq("status_id", id);

  if (error) {
    throw new Error("Fehler beim Prüfen der Verwendung");
  }

  return count || 0;
}

export async function deleteGeraetestatus(id: string) {
  const supabase = await createClient();

  // Check if status is being used
  const usageCount = await getStatusUsageCount(id);
  if (usageCount > 0) {
    throw new Error(`Dieser Status wird noch von ${usageCount} Gerät(en) verwendet und kann nicht gelöscht werden`);
  }

  const { error } = await supabase.from("status").delete().eq("id", id);

  if (error) {
    throw new Error("Fehler beim Löschen des Status");
  }

  revalidatePath("/admin/status");
  revalidatePath("/geraete");
}

// =====================
// Gerätearten
// =====================

export async function getGeraetearten() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("geraetearten")
    .select("*")
    .order("sortierung");

  if (error) {
    throw new Error("Fehler beim Laden der Gerätearten");
  }

  return data;
}

export async function createGeraeteart(values: { bezeichnung: string }) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("geraetearten")
    .insert(values)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("Eine Geräteart mit dieser Bezeichnung existiert bereits");
    }
    throw new Error("Fehler beim Erstellen der Geräteart");
  }

  revalidatePath("/admin/geraetearten");
  revalidatePath("/geraete");
  return data;
}

export async function updateGeraeteart(id: string, values: { bezeichnung: string }) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("geraetearten")
    .update(values)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("Eine Geräteart mit dieser Bezeichnung existiert bereits");
    }
    throw new Error("Fehler beim Aktualisieren der Geräteart");
  }

  revalidatePath("/admin/geraetearten");
  revalidatePath("/geraete");
  return data;
}

export async function getGeraeteartUsageCount(id: string) {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("geraete")
    .select("*", { count: "exact", head: true })
    .eq("geraeteart_id", id);

  if (error) {
    throw new Error("Fehler beim Prüfen der Verwendung");
  }

  return count || 0;
}

export async function deleteGeraeteart(id: string) {
  const supabase = await createClient();

  // Check if Geräteart is being used
  const usageCount = await getGeraeteartUsageCount(id);
  if (usageCount > 0) {
    throw new Error(`Diese Geräteart wird noch von ${usageCount} Gerät(en) verwendet und kann nicht gelöscht werden`);
  }

  const { error } = await supabase.from("geraetearten").delete().eq("id", id);

  if (error) {
    throw new Error("Fehler beim Löschen der Geräteart");
  }

  revalidatePath("/admin/geraetearten");
  revalidatePath("/geraete");
}

// =====================
// Wartungsarten
// =====================

export async function getWartungsarten() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("wartungsarten")
    .select("*")
    .order("sortierung");

  if (error) {
    throw new Error("Fehler beim Laden der Wartungsarten");
  }

  return data;
}

export async function createWartungsart(values: { bezeichnung: string }) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("wartungsarten")
    .insert(values)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("Eine Wartungsart mit dieser Bezeichnung existiert bereits");
    }
    throw new Error("Fehler beim Erstellen der Wartungsart");
  }

  revalidatePath("/admin/wartungsarten");
  revalidatePath("/wartungen");
  return data;
}

export async function updateWartungsart(id: string, values: { bezeichnung: string }) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("wartungsarten")
    .update(values)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("Eine Wartungsart mit dieser Bezeichnung existiert bereits");
    }
    throw new Error("Fehler beim Aktualisieren der Wartungsart");
  }

  revalidatePath("/admin/wartungsarten");
  revalidatePath("/wartungen");
  return data;
}

export async function getWartungsartUsageCount(id: string) {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("wartungen")
    .select("*", { count: "exact", head: true })
    .eq("wartungsart_id", id);

  if (error) {
    throw new Error("Fehler beim Prüfen der Verwendung");
  }

  return count || 0;
}

export async function deleteWartungsart(id: string) {
  const supabase = await createClient();

  // Check if Wartungsart is being used
  const usageCount = await getWartungsartUsageCount(id);
  if (usageCount > 0) {
    throw new Error(`Diese Wartungsart wird noch von ${usageCount} Wartung(en) verwendet und kann nicht gelöscht werden`);
  }

  const { error } = await supabase.from("wartungsarten").delete().eq("id", id);

  if (error) {
    throw new Error("Fehler beim Löschen der Wartungsart");
  }

  revalidatePath("/admin/wartungsarten");
  revalidatePath("/wartungen");
}

// =====================
// Benutzer
// =====================

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

export async function inviteBenutzer(email: string, rolle: "admin" | "user" = "user") {
  const supabase = await createClient();

  // Use Supabase Admin API to invite user
  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
    data: { rolle },
  });

  if (error) {
    if (error.message.includes("already registered")) {
      throw new Error("Diese E-Mail-Adresse ist bereits registriert");
    }
    throw new Error("Fehler beim Einladen des Benutzers: " + error.message);
  }

  revalidatePath("/admin/benutzer");
  return data;
}
