"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { Plus, Calendar } from "lucide-react";

export default function EinsaetzePage() {
  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Einsätze"
        description="Übersicht aller Geräteeinsätze"
      >
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Neuer Einsatz
        </Button>
      </PageHeader>

      <EmptyState
        title="Keine Einsätze vorhanden"
        description="Erstellen Sie einen neuen Einsatz, um zu beginnen."
        icon={<Calendar className="h-6 w-6 text-muted-foreground" />}
      >
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Einsatz erstellen
        </Button>
      </EmptyState>
    </div>
  );
}
