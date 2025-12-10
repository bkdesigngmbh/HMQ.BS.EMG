"use client";

import { useParams } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";

export default function GeraeteDetailPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/geraete">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <PageHeader
          title={`Gerät ${id}`}
          description="Gerätedetails und Historie"
        >
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Bearbeiten
          </Button>
        </PageHeader>
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="einsaetze">Einsätze</TabsTrigger>
          <TabsTrigger value="wartungen">Wartungen</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Geräteinformationen</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Gerätedetails werden hier angezeigt.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="einsaetze" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Einsatzhistorie</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Noch keine Einsätze für dieses Gerät.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wartungen" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Wartungshistorie</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Noch keine Wartungen für dieses Gerät.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
