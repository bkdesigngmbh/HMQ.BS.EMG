import { Suspense } from "react";
import { getGeraete, getGeraetearten, getGeraetestatus } from "@/lib/actions/geraete";
import { GeraetePageClient } from "./page-client";
import { LoadingSpinner } from "@/components/shared/loading-spinner";

export default async function GeraetePage() {
  const [geraete, geraetearten, statusListe] = await Promise.all([
    getGeraete(),
    getGeraetearten(),
    getGeraetestatus(),
  ]);

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
