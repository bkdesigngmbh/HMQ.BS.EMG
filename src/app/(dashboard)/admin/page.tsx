"use client";

import { AdminGuard } from "@/components/layout/admin-guard";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tag, Wrench, Users, Activity } from "lucide-react";
import Link from "next/link";

const adminSections = [
  {
    title: "Gerätestatus",
    description: "Status-Bezeichnungen und Farben verwalten",
    href: "/admin/status",
    icon: Activity,
  },
  {
    title: "Gerätearten",
    description: "Typen von Messgeräten verwalten",
    href: "/admin/geraetearten",
    icon: Tag,
  },
  {
    title: "Wartungsarten",
    description: "Wartungstypen und Intervalle verwalten",
    href: "/admin/wartungsarten",
    icon: Wrench,
  },
  {
    title: "Benutzer",
    description: "Benutzerkonten und Rollen verwalten",
    href: "/admin/benutzer",
    icon: Users,
  },
];

export default function AdminPage() {
  return (
    <AdminGuard>
      <div className="p-6 space-y-6">
        <PageHeader
          title="Administration"
          description="Systemeinstellungen und Stammdaten verwalten"
        />

        <div className="grid gap-4 md:grid-cols-2">
          {adminSections.map((section) => {
            const Icon = section.icon;
            return (
              <Link key={section.href} href={section.href}>
                <Card className="h-full transition-colors hover:bg-muted/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon className="h-5 w-5" />
                      {section.title}
                    </CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </AdminGuard>
  );
}
