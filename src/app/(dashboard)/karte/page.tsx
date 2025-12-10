import { Suspense } from "react";
import dynamic from "next/dynamic";
import { getAktiveEinsaetze } from "@/lib/actions/einsaetze";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { Map, MapPin } from "lucide-react";

// Dynamischer Import für Leaflet (Client-only)
const LeafletMap = dynamic(
  () => import("@/components/map/leaflet-map").then((mod) => mod.LeafletMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[600px] items-center justify-center rounded-lg border">
        <LoadingSpinner />
      </div>
    ),
  }
);

export default async function KartePage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const aktiveEinsaetze: any[] = await getAktiveEinsaetze();

  const einsaetzeMitKoordinaten = aktiveEinsaetze.filter(
    (e) => e.lat !== null && e.lng !== null
  );

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Karte"
        description="Übersicht aller aktiven Geräteeinsätze auf der Karte"
      />

      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          <span>
            {einsaetzeMitKoordinaten.length} von {aktiveEinsaetze.length}{" "}
            Einsätzen mit Koordinaten
          </span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="h-5 w-5" />
            Aktive Einsätze
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense
            fallback={
              <div className="flex h-[600px] items-center justify-center rounded-lg border">
                <LoadingSpinner />
              </div>
            }
          >
            <LeafletMap einsaetze={aktiveEinsaetze} />
          </Suspense>
        </CardContent>
      </Card>

      {aktiveEinsaetze.length > 0 &&
        einsaetzeMitKoordinaten.length < aktiveEinsaetze.length && (
          <Card>
            <CardHeader>
              <CardTitle>Einsätze ohne Koordinaten</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {aktiveEinsaetze
                  .filter((e) => e.lat === null || e.lng === null)
                  .map((einsatz) => (
                    <div
                      key={einsatz.id}
                      className="flex items-center justify-between p-2 rounded border"
                    >
                      <div>
                        <span className="font-medium">{einsatz.geraet.name}</span>
                        <span className="text-muted-foreground ml-2">
                          ({einsatz.auftrag.auftragsnummer})
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {einsatz.ort || einsatz.auftrag.auftragsort || "Kein Ort"}
                      </span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
