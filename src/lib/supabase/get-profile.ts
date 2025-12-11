import { createClient } from "./server";

export interface Profile {
  id: string;
  email: string;
  name: string | null;
  rolle: "admin" | "user";
}

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("getProfile: Kein User gefunden", userError?.message);
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, email, name, rolle")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("getProfile: Fehler beim Laden:", profileError.message);
    return null;
  }

  if (!profile) {
    console.error("getProfile: Kein Profil für User:", user.id);
    return null;
  }

  return {
    id: profile.id,
    email: profile.email,
    name: profile.name,
    rolle: profile.rolle,
  };
}
