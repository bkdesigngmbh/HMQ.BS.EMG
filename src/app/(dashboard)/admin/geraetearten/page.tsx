import { Suspense } from "react";
import { getGeraetearten } from "@/lib/actions/admin";
import { GeraeteartenPageClient } from "./page-client";
import { LoadingSpinner } from "@/components/shared/loading-spinner";

export default async function GeraeteartenPage() {
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
