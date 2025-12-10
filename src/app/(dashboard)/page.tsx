import { Suspense } from "react";
import { getGeraeteStatistiken } from "@/lib/actions/geraete";
import { getAktiveAuftraege } from "@/lib/actions/auftraege";
import { getAktiveEinsaetze } from "@/lib/actions/einsaetze";
import { getAnstehendeWartungen } from "@/lib/actions/wartungen";
import { DashboardContent } from "./dashboard-content";
import { LoadingSpinner } from "@/components/shared/loading-spinner";

export default async function DashboardPage() {
  const [statistiken, aktiveAuftraege, aktiveEinsaetze, anstehendeWartungen] =
    await Promise.all([
      getGeraeteStatistiken(),
      getAktiveAuftraege(),
      getAktiveEinsaetze(),
      getAnstehendeWartungen(),
    ]);

  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <LoadingSpinner />
        </div>
      }
    >
      <DashboardContent
        statistiken={statistiken}
        aktiveAuftraege={aktiveAuftraege}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        aktiveEinsaetze={aktiveEinsaetze as any}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        anstehendeWartungen={anstehendeWartungen as any}
      />
    </Suspense>
  );
}
