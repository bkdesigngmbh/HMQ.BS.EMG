import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBenutzer } from "@/lib/actions/admin";
import { BenutzerPageClient } from "./page-client";
import { LoadingSpinner } from "@/components/shared/loading-spinner";

export const dynamic = "force-dynamic";

export default async function BenutzerPage() {
  // Admin-Prüfung serverseitig
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("rolle")
    .eq("id", user.id)
    .single();

  if (profile?.rolle !== "admin") {
    redirect("/");
  }

  let benutzer: Awaited<ReturnType<typeof getBenutzer>> = [];

  try {
    benutzer = await getBenutzer();
  } catch (error) {
    console.error("Fehler beim Laden der Benutzer:", error);
  }

  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <LoadingSpinner />
        </div>
      }
    >
      <BenutzerPageClient initialBenutzer={benutzer} />
    </Suspense>
  );
}
