import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getGeraetestatus } from "@/lib/actions/admin";
import { StatusPageClient } from "./page-client";
import { LoadingSpinner } from "@/components/shared/loading-spinner";

export const dynamic = "force-dynamic";

export default async function StatusPage() {
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

  let statusListe: Awaited<ReturnType<typeof getGeraetestatus>> = [];

  try {
    statusListe = await getGeraetestatus();
  } catch (error) {
    console.error("Fehler beim Laden der Status:", error);
  }

  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <LoadingSpinner />
        </div>
      }
    >
      <StatusPageClient initialStatus={statusListe} />
    </Suspense>
  );
}
