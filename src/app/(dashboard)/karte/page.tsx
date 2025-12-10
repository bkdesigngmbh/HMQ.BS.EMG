"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Map } from "lucide-react";

export default function KartePage() {
  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Karte"
        description="Übersicht aller aktiven Geräteeinsätze auf der Karte"
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="h-5 w-5" />
            Kartenansicht
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[500px] items-center justify-center rounded-lg border border-dashed">
            <div className="text-center">
              <Map className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">
                Die Kartenansicht wird in der nächsten Phase implementiert.
              </p>
              <p className="text-sm text-muted-foreground">
                (Leaflet Integration)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
