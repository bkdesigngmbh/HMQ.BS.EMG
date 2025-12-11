import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export const dynamic = "force-dynamic";

// Profil-Typ für serverseitige Daten
export interface ServerProfile {
  id: string;
  email: string;
  name: string | null;
  rolle: "admin" | "user";
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: ServerProfile | null = null;

  if (user) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!error && data) {
      profile = {
        id: data.id,
        email: data.email,
        name: data.name,
        rolle: data.rolle,
      };
    }
  }

  return <DashboardShell profile={profile}>{children}</DashboardShell>;
}
