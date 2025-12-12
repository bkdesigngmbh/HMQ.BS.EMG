import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getGeraetearten } from "@/lib/actions/admin";
import { GeraeteartenPageClient } from "./page-client";
import { LoadingSpinner } from "@/components/shared/loading-spinner";

export const dynamic = "force-dynamic";

export default async function GeraeteartenPage() {
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

  let geraetearten: Awaited<ReturnType<typeof getGeraetearten>> = [];

  try {
    geraetearten = await getGeraetearten();
  } catch (error) {
    console.error("Fehler beim Laden der Gerätearten:", error);
  }

  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <LoadingSpinner />
        </div>
      }
    >
      <GeraeteartenPageClient initialGeraetearten={geraetearten} />
    </Suspense>
  );
}
