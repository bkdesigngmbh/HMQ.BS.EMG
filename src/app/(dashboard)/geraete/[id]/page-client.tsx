"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { GeraeteDialog } from "@/components/geraete/geraete-dialog";
import { WartungDialog } from "@/components/wartungen/wartung-dialog";
import { ArrowLeft, Edit, Plus, Calendar, MapPin } from "lucide-react";
import { updateGeraet } from "@/lib/actions/geraete";
import { createWartung } from "@/lib/actions/wartungen";
import { transformGeraetValues, type GeraetFormValues } from "@/lib/validations/geraet";
import { transformWartungValues, type WartungFormValues } from "@/lib/validations/wartung";
import type {
  Geraeteart,
  Geraetestatus,
  Wartungsart,
} from "@/types/database";

interface GeraeteDetailClientProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  geraet: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  einsaetze: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  wartungen: any[];
  geraetearten: Geraeteart[];
  statusListe: Geraetestatus[];
  wartungsarten: Wartungsart[];
}

export function GeraeteDetailClient({
  geraet,
  einsaetze,
  wartungen,
  geraetearten,
  statusListe,
  wartungsarten,
}: GeraeteDetailClientProps) {
  const router = useRouter();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [wartungDialogOpen, setWartungDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateGeraet = async (values: GeraetFormValues) => {
    setIsLoading(true);
    try {
      const transformedValues = transformGeraetValues(values);
      await updateGeraet(geraet.id, transformedValues);
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateWartung = async (values: WartungFormValues) => {
    setIsLoading(true);
    try {
      const transformedValues = transformWartungValues(values);
      await createWartung({ ...transformedValues, geraet_id: geraet.id });
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("de-CH");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/geraete">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <PageHeader
            title={geraet.name}
            description={`Seriennummer: ${geraet.seriennummer}`}
          >
            <div className="flex items-center gap-2">
              {geraet.status && (
                <StatusBadge
                  status={geraet.status.name}
                  color={geraet.status.farbe}
                />
              )}
              <Button variant="outline" onClick={() => setEditDialogOpen(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Bearbeiten
              </Button>
            </div>
          </PageHeader>
        </div>
      </div>

      {/* Aktiver Einsatz Banner */}
      {geraet.aktiver_einsatz && (
        <Card className="border-green-500 bg-green-50 dark:bg-green-950">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <MapPin className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Aktuell im Einsatz</p>
                  <p className="text-sm text-muted-foreground">
                    Auftrag: {geraet.aktiver_einsatz.auftrag.auftragsnummer}
                    {geraet.aktiver_einsatz.ort &&
                      ` - ${geraet.aktiver_einsatz.ort}`}
                  </p>
                </div>
              </div>
              <Link href={`/einsaetze/${geraet.aktiver_einsatz.id}`}>
                <Button variant="outline" size="sm">
                  Details
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="einsaetze">
            Einsätze ({einsaetze.length})
          </TabsTrigger>
          <TabsTrigger value="wartungen">
            Wartungen ({wartungen.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Geräteinformationen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Eigentum</span>
                  <Badge
                    variant={geraet.eigentum === "eigen" ? "default" : "secondary"}
                  >
                    {geraet.eigentum === "eigen" ? "Eigen" : "Miete"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Geräteart</span>
                  <span>{geraet.geraeteart?.name || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  {geraet.status ? (
                    <StatusBadge
                      status={geraet.status.name}
                      color={geraet.status.farbe}
                    />
                  ) : (
                    "-"
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Kaufdatum</span>
                  <span>{formatDate(geraet.kaufdatum)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Technische Daten</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Client</span>
                  <span className="font-mono">{geraet.client || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">IP-Adresse</span>
                  <span className="font-mono">{geraet.ip_adresse || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">PIN</span>
                  <span className="font-mono">{geraet.pin || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nächster Service</span>
                  <span
                    className={
                      geraet.naechster_service &&
                      new Date(geraet.naechster_service) < new Date()
                        ? "text-red-600 font-medium"
                        : ""
                    }
                  >
                    {formatDate(geraet.naechster_service)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {geraet.notizen && (
            <Card>
              <CardHeader>
                <CardTitle>Notizen</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{geraet.notizen}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="einsaetze" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Einsatzhistorie</CardTitle>
            </CardHeader>
            <CardContent>
              {einsaetze.length === 0 ? (
                <p className="text-muted-foreground">
                  Noch keine Einsätze für dieses Gerät.
                </p>
              ) : (
                <div className="space-y-3">
                  {einsaetze.map((einsatz) => (
                    <Link
                      key={einsatz.id}
                      href={`/einsaetze/${einsatz.id}`}
                      className="block"
                    >
                      <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">
                              {einsatz.auftrag.auftragsnummer}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {einsatz.ort || einsatz.auftrag.auftragsort || "Kein Ort"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">
                            {formatDate(einsatz.von_datum)} -{" "}
                            {einsatz.bis_effektiv
                              ? formatDate(einsatz.bis_effektiv)
                              : "laufend"}
                          </p>
                          {!einsatz.bis_effektiv && (
                            <Badge variant="default" className="mt-1">
                              Aktiv
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wartungen" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Wartungshistorie</CardTitle>
              <Button onClick={() => setWartungDialogOpen(true)} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Wartung erfassen
              </Button>
            </CardHeader>
            <CardContent>
              {wartungen.length === 0 ? (
                <p className="text-muted-foreground">
                  Noch keine Wartungen für dieses Gerät.
                </p>
              ) : (
                <div className="space-y-3">
                  {wartungen.map((wartung) => (
                    <div
                      key={wartung.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div>
                        <p className="font-medium">
                          {wartung.wartungsart?.name || "Wartung"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {wartung.durchgefuehrt_von
                            ? `Durchgeführt von: ${wartung.durchgefuehrt_von}`
                            : ""}
                          {wartung.notizen && (
                            <span className="block">{wartung.notizen}</span>
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {formatDate(wartung.datum)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <GeraeteDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        geraet={geraet}
        geraetearten={geraetearten}
        statusListe={statusListe}
        onSave={handleUpdateGeraet}
        isLoading={isLoading}
      />

      <WartungDialog
        open={wartungDialogOpen}
        onOpenChange={setWartungDialogOpen}
        geraetId={geraet.id}
        wartungsarten={wartungsarten}
        onSave={handleCreateWartung}
        isLoading={isLoading}
      />
    </div>
  );
}
