"use client";

import { useUser } from "@/lib/hooks/use-user";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  title: string;
  description?: string;
}

export function Header({ title, description }: HeaderProps) {
  const { profile } = useUser();

  return (
    <header className="border-b bg-background">
      <div className="flex h-16 items-center justify-between px-6">
        <div>
          <h1 className="text-xl font-semibold">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-4">
          {profile?.rolle === "admin" && (
            <Badge variant="secondary">Admin</Badge>
          )}
        </div>
      </div>
    </header>
  );
}
