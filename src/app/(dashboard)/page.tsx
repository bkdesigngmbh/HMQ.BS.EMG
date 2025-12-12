import { Suspense } from "react";
import { getGeraeteStatistiken } from "@/lib/actions/geraete";
import { getAktiveAuftraege } from "@/lib/actions/auftraege";
import { getAktiveEinsaetze } from "@/lib/actions/einsaetze";
import { getAnstehendeWartungen } from "@/lib/actions/wartungen";
import { DashboardContent } from "./dashboard-content";
import { LoadingSpinner } from "@/components/shared/loading-spinner";

export const dynamic = "force-dynamic";

// Default values for when queries fail
const defaultStatistiken = {
  gesamt: 0,
  imBuero: 0,
  imEinsatz: 0,
  inWartung: 0,
  defekt: 0,
};

export default async function DashboardPage() {
  // Fetch data with error handling for each query
  let statistiken = defaultStatistiken;
  let aktiveAuftraege: Awaited<ReturnType<typeof getAktiveAuftraege>> = [];
  let aktiveEinsaetze: Awaited<ReturnType<typeof getAktiveEinsaetze>> = [];
  let anstehendeWartungen: Awaited<ReturnType<typeof getAnstehendeWartungen>> = [];

  try {
    statistiken = await getGeraeteStatistiken();
  } catch (error) {
    console.error("Fehler beim Laden der Statistiken:", error);
  }

  try {
    aktiveAuftraege = await getAktiveAuftraege();
  } catch (error) {
    console.error("Fehler beim Laden der aktiven Aufträge:", error);
  }

  try {
    aktiveEinsaetze = await getAktiveEinsaetze();
  } catch (error) {
    console.error("Fehler beim Laden der aktiven Einsätze:", error);
  }

  try {
    anstehendeWartungen = await getAnstehendeWartungen();
  } catch (error) {
    console.error("Fehler beim Laden der anstehenden Wartungen:", error);
  }

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        aktiveAuftraege={aktiveAuftraege as any}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        aktiveEinsaetze={aktiveEinsaetze as any}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        anstehendeWartungen={anstehendeWartungen as any}
      />
    </Suspense>
  );
}
