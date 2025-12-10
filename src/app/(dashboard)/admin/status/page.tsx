import { Suspense } from "react";
import { getGeraetestatus } from "@/lib/actions/admin";
import { StatusPageClient } from "./page-client";
import { LoadingSpinner } from "@/components/shared/loading-spinner";

export default async function StatusPage() {
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
