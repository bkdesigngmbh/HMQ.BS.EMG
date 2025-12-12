import { Suspense } from "react";
import {
  getGeraeteStatistiken,
  getVerfuegbareGeraete,
  getImEinsatzStatusId,
  getGeraetestatus,
} from "@/lib/actions/geraete";
import {
  getAktiveAuftraege,
  getAktiveAuftraegeMitEinsaetze,
} from "@/lib/actions/auftraege";
import { getAktiveEinsaetze } from "@/lib/actions/einsaetze";
import { getAnstehendeWartungen } from "@/lib/actions/wartungen";
import { DashboardContent } from "./dashboard-content";
import { GeraeteBoard } from "@/components/dashboard/geraete-board";
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
  let anstehendeWartungen: Awaited<ReturnType<typeof getAnstehendeWartungen>> =
    [];
  let verfuegbareGeraete: Awaited<ReturnType<typeof getVerfuegbareGeraete>> =
    [];
  let auftraegeMitEinsaetze: Awaited<
    ReturnType<typeof getAktiveAuftraegeMitEinsaetze>
  > = [];
  let imEinsatzStatusId: string | null = null;
  let statusListe: Awaited<ReturnType<typeof getGeraetestatus>> = [];

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

  try {
    verfuegbareGeraete = await getVerfuegbareGeraete();
  } catch (error) {
    console.error("Fehler beim Laden der verfügbaren Geräte:", error);
  }

  try {
    auftraegeMitEinsaetze = await getAktiveAuftraegeMitEinsaetze();
  } catch (error) {
    console.error("Fehler beim Laden der Aufträge mit Einsätzen:", error);
  }

  try {
    imEinsatzStatusId = await getImEinsatzStatusId();
  } catch (error) {
    console.error("Fehler beim Laden des Im-Einsatz-Status:", error);
  }

  try {
    statusListe = await getGeraetestatus();
  } catch (error) {
    console.error("Fehler beim Laden der Status-Liste:", error);
  }

  // Transform verfuegbare Geräte for the board
  const geraeteFuerBoard = verfuegbareGeraete.map((g) => ({
    id: g.id,
    name: g.name,
    client: g.client,
    geraeteart: g.geraeteart,
    status: g.status,
  }));

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

      {/* Drag & Drop Geräte-Board */}
      <div className="px-6 pb-6">
        <GeraeteBoard
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          verfuegbareGeraete={geraeteFuerBoard as any}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          aktiveAuftraege={auftraegeMitEinsaetze as any}
          imEinsatzStatusId={imEinsatzStatusId || ""}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          statusListe={statusListe as any}
        />
      </div>
    </Suspense>
  );
}
