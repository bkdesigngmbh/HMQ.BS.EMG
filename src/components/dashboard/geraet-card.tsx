"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Box } from "lucide-react";

interface Geraet {
  id: string;
  name: string;
  client: string | null;
  geraeteart: { bezeichnung: string } | null;
  status: { id: string; bezeichnung: string; farbe: string } | null;
}

interface GeraetCardProps {
  geraet: Geraet;
  isDragging?: boolean;
}

export function GeraetCard({ geraet, isDragging }: GeraetCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 p-3 bg-background border rounded-lg cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow min-w-[140px]",
        isDragging && "shadow-lg ring-2 ring-primary"
      )}
    >
      <div className="flex items-center gap-2">
        <Box className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium text-sm">{geraet.name}</span>
      </div>
      {geraet.client && (
        <span className="text-xs text-muted-foreground">{geraet.client}</span>
      )}
      {geraet.geraeteart && (
        <Badge variant="secondary" className="text-xs w-fit">
          {geraet.geraeteart.bezeichnung}
        </Badge>
      )}
    </div>
  );
}
