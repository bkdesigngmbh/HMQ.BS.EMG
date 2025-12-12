import { Suspense } from "react";
import {
  getGeraete,
  getGeraetearten,
  getGeraetestatus,
  getVerfuegbareGeraete,
  getImEinsatzStatusId,
} from "@/lib/actions/geraete";
import {
  getAuftraege,
  getNextAuftragsnummer,
  getAktiveAuftraegeMitEinsaetze,
} from "@/lib/actions/auftraege";
import { AuftraegeGeraeteContent } from "./page-content";
import { LoadingSpinner } from "@/components/shared/loading-spinner";

export const dynamic = "force-dynamic";

export default async function AuftraegeGeraetePage() {
  // Fetch all data with error handling
  let geraete: Awaited<ReturnType<typeof getGeraete>> = [];
  let geraetearten: Awaited<ReturnType<typeof getGeraetearten>> = [];
  let statusListe: Awaited<ReturnType<typeof getGeraetestatus>> = [];
  let verfuegbareGeraete: Awaited<ReturnType<typeof getVerfuegbareGeraete>> = [];
  let auftraege: Awaited<ReturnType<typeof getAuftraege>> = [];
  let auftraegeMitEinsaetze: Awaited<
    ReturnType<typeof getAktiveAuftraegeMitEinsaetze>
  > = [];
  let nextAuftragsnummer = "";
  let imEinsatzStatusId: string | null = null;

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

  try {
    verfuegbareGeraete = await getVerfuegbareGeraete();
  } catch (error) {
    console.error("Fehler beim Laden der verfügbaren Geräte:", error);
  }

  try {
    auftraege = await getAuftraege();
  } catch (error) {
    console.error("Fehler beim Laden der Aufträge:", error);
  }

  try {
    auftraegeMitEinsaetze = await getAktiveAuftraegeMitEinsaetze();
  } catch (error) {
    console.error("Fehler beim Laden der Aufträge mit Einsätzen:", error);
  }

  try {
    nextAuftragsnummer = await getNextAuftragsnummer();
  } catch (error) {
    console.error("Fehler beim Laden der nächsten Auftragsnummer:", error);
  }

  try {
    imEinsatzStatusId = await getImEinsatzStatusId();
  } catch (error) {
    console.error("Fehler beim Laden des Im-Einsatz-Status:", error);
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
      <AuftraegeGeraeteContent
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        geraete={geraete as any}
        geraetearten={geraetearten}
        statusListe={statusListe}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        auftraege={auftraege as any}
        nextAuftragsnummer={nextAuftragsnummer}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        geraeteFuerBoard={geraeteFuerBoard as any}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        auftraegeMitEinsaetze={auftraegeMitEinsaetze as any}
        imEinsatzStatusId={imEinsatzStatusId || ""}
      />
    </Suspense>
  );
}
