"use client";

import { AdminGuard } from "@/components/layout/admin-guard";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { Plus, Activity, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function StatusPage() {
  return (
    <AdminGuard>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <PageHeader
            title="Gerätestatus"
            description="Status-Bezeichnungen und Farben verwalten"
          >
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Neuer Status
            </Button>
          </PageHeader>
        </div>

        <EmptyState
          title="Keine Status vorhanden"
          description="Erstellen Sie Status-Bezeichnungen für Ihre Geräte."
          icon={<Activity className="h-6 w-6 text-muted-foreground" />}
        >
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Status erstellen
          </Button>
        </EmptyState>
      </div>
    </AdminGuard>
  );
}
