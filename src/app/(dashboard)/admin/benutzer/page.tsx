import { Suspense } from "react";
import { getBenutzer } from "@/lib/actions/admin";
import { BenutzerPageClient } from "./page-client";
import { LoadingSpinner } from "@/components/shared/loading-spinner";

export const dynamic = "force-dynamic";

export default async function BenutzerPage() {
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
