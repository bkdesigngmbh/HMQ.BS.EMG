"use client";

import { useParams } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";

export default function AuftragsDetailPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/auftraege">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <PageHeader
          title={`Auftrag ${id}`}
          description="Auftragsdetails und zugehörige Einsätze"
        >
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Bearbeiten
          </Button>
        </PageHeader>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Auftragsinformationen</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Auftragsdetails werden hier angezeigt.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Zugehörige Einsätze</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Noch keine Einsätze für diesen Auftrag.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
