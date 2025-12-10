import { Suspense } from "react";
import { getAuftraege, getNextAuftragsnummer } from "@/lib/actions/auftraege";
import { AuftraegePageClient } from "./page-client";
import { LoadingSpinner } from "@/components/shared/loading-spinner";

export const dynamic = "force-dynamic";

export default async function AuftraegePage() {
  const [auftraege, nextAuftragsnummer] = await Promise.all([
    getAuftraege(),
    getNextAuftragsnummer(),
  ]);

  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <LoadingSpinner />
        </div>
      }
    >
      <AuftraegePageClient
        initialAuftraege={auftraege}
        nextAuftragsnummer={nextAuftragsnummer}
      />
    </Suspense>
  );
}
