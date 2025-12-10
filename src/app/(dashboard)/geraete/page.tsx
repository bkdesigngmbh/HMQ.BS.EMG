import { Suspense } from "react";
import { getGeraete, getGeraetearten, getGeraetestatus } from "@/lib/actions/geraete";
import { GeraetePageClient } from "./page-client";
import { LoadingSpinner } from "@/components/shared/loading-spinner";

export default async function GeraetePage() {
  // Fetch data with error handling
  let geraete: Awaited<ReturnType<typeof getGeraete>> = [];
  let geraetearten: Awaited<ReturnType<typeof getGeraetearten>> = [];
  let statusListe: Awaited<ReturnType<typeof getGeraetestatus>> = [];

  try {
    geraete = await getGeraete();
  } catch (error) {
    console.error("Fehler beim Laden der Geräte:", error);
  }

  try {
    geraetearten = await getGeraetearten();
  } catch (error) {
    console.error("Fehler beim Laden der Gerätearten:", error);
  }

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
      <GeraetePageClient
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        initialGeraete={geraete as any}
        geraetearten={geraetearten}
        statusListe={statusListe}
      />
    </Suspense>
  );
}
