import { Suspense } from "react";
import { getEinsaetze } from "@/lib/actions/einsaetze";
import { getVerfuegbareGeraete } from "@/lib/actions/geraete";
import { getAktiveAuftraege } from "@/lib/actions/auftraege";
import { EinsaetzePageClient } from "./page-client";
import { LoadingSpinner } from "@/components/shared/loading-spinner";

export default async function EinsaetzePage() {
  // Fetch data with error handling
  let einsaetze: Awaited<ReturnType<typeof getEinsaetze>> = [];
  let verfuegbareGeraete: Awaited<ReturnType<typeof getVerfuegbareGeraete>> = [];
  let auftraege: Awaited<ReturnType<typeof getAktiveAuftraege>> = [];

  try {
    einsaetze = await getEinsaetze();
  } catch (error) {
    console.error("Fehler beim Laden der Einsätze:", error);
  }

  try {
    verfuegbareGeraete = await getVerfuegbareGeraete();
  } catch (error) {
    console.error("Fehler beim Laden der verfügbaren Geräte:", error);
  }

  try {
    auftraege = await getAktiveAuftraege();
  } catch (error) {
    console.error("Fehler beim Laden der Aufträge:", error);
  }

  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <LoadingSpinner />
        </div>
      }
    >
      <EinsaetzePageClient
        initialEinsaetze={einsaetze}
        verfuegbareGeraete={verfuegbareGeraete}
        auftraege={auftraege}
      />
    </Suspense>
  );
}
