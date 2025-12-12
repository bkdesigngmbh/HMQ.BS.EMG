import { redirect } from "next/navigation";
import { getProfile } from "@/lib/supabase/get-profile";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();

  // Redirect zu Login wenn kein Profil (nicht eingeloggt)
  if (!profile) {
    redirect("/login");
  }

  return <DashboardShell profile={profile}>{children}</DashboardShell>;
}
