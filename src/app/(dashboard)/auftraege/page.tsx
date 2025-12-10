"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { Plus, FileText } from "lucide-react";

export default function AuftraegePage() {
  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Aufträge"
        description="Verwaltung aller Aufträge"
      >
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Neuer Auftrag
        </Button>
      </PageHeader>

      <EmptyState
        title="Keine Aufträge vorhanden"
        description="Erstellen Sie einen neuen Auftrag, um zu beginnen."
        icon={<FileText className="h-6 w-6 text-muted-foreground" />}
      >
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Auftrag erstellen
        </Button>
      </EmptyState>
    </div>
  );
}
