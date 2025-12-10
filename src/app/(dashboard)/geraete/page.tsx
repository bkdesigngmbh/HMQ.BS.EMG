"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { Plus, Box } from "lucide-react";

export default function GeraetePage() {
  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Geräte"
        description="Verwaltung aller Erschütterungsmessgeräte"
      >
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Neues Gerät
        </Button>
      </PageHeader>

      <EmptyState
        title="Keine Geräte vorhanden"
        description="Erstellen Sie ein neues Gerät, um zu beginnen."
        icon={<Box className="h-6 w-6 text-muted-foreground" />}
      >
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Gerät erstellen
        </Button>
      </EmptyState>
    </div>
  );
}
