import { Suspense } from "react";
import { getWartungsarten } from "@/lib/actions/admin";
import { WartungsartenPageClient } from "./page-client";
import { LoadingSpinner } from "@/components/shared/loading-spinner";

export default async function WartungsartenPage() {
  let wartungsarten: Awaited<ReturnType<typeof getWartungsarten>> = [];

  try {
    wartungsarten = await getWartungsarten();
  } catch (error) {
    console.error("Fehler beim Laden der Wartungsarten:", error);
  }

  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <LoadingSpinner />
        </div>
      }
    >
      <WartungsartenPageClient initialWartungsarten={wartungsarten} />
    </Suspense>
  );
}
