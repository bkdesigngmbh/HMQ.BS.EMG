"use client";

import { AdminGuard } from "@/components/layout/admin-guard";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { Plus, Users, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function BenutzerPage() {
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
            title="Benutzer"
            description="Benutzerkonten und Rollen verwalten"
          >
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Neuer Benutzer
            </Button>
          </PageHeader>
        </div>

        <EmptyState
          title="Keine Benutzer vorhanden"
          description="Laden Sie Benutzer ein oder erstellen Sie neue Benutzerkonten."
          icon={<Users className="h-6 w-6 text-muted-foreground" />}
        >
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Benutzer einladen
          </Button>
        </EmptyState>
      </div>
    </AdminGuard>
  );
}
