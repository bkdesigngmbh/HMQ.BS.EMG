import { Suspense } from "react";
import { getEinsaetze } from "@/lib/actions/einsaetze";
import { getVerfuegbareGeraete } from "@/lib/actions/geraete";
import { getAktiveAuftraege } from "@/lib/actions/auftraege";
import { EinsaetzePageClient } from "./page-client";
import { LoadingSpinner } from "@/components/shared/loading-spinner";

export default async function EinsaetzePage() {
  const [einsaetze, verfuegbareGeraete, auftraege] = await Promise.all([
    getEinsaetze(),
    getVerfuegbareGeraete(),
    getAktiveAuftraege(),
  ]);

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
