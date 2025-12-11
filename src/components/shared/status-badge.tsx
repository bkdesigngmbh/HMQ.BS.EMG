"use client";

import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  color?: string;
  size?: "sm" | "md";
  className?: string;
}

export function StatusBadge({
  status,
  color,
  size = "md",
  className,
}: StatusBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
  };

  const dotSizeClasses = {
    sm: "h-1.5 w-1.5",
    md: "h-2 w-2",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border bg-background font-medium",
        sizeClasses[size],
        className
      )}
      style={color ? { borderColor: color } : undefined}
    >
      <span
        className={cn("rounded-full", dotSizeClasses[size])}
        style={{ backgroundColor: color || "currentColor" }}
      />
      <span style={color ? { color } : undefined}>{status}</span>
    </span>
  );
}

interface AuftragStatusBadgeProps {
  status: "offen" | "aktiv" | "abgeschlossen" | "inaktiv";
  size?: "sm" | "md";
}

export function AuftragStatusBadge({
  status,
  size = "md",
}: AuftragStatusBadgeProps) {
  const statusConfig = {
    offen: { label: "Offen", color: "#f59e0b" },
    aktiv: { label: "Aktiv", color: "#22c55e" },
    abgeschlossen: { label: "Abgeschlossen", color: "#6b7280" },
    inaktiv: { label: "Inaktiv", color: "#6b7280" },
  };

  const config = statusConfig[status];

  return <StatusBadge status={config.label} color={config.color} size={size} />;
}

interface EinsatzStatusBadgeProps {
  isAktiv: boolean;
  size?: "sm" | "md";
}

export function EinsatzStatusBadge({
  isAktiv,
  size = "md",
}: EinsatzStatusBadgeProps) {
  return (
    <StatusBadge
      status={isAktiv ? "Laufend" : "Beendet"}
      color={isAktiv ? "#22c55e" : "#6b7280"}
      size={size}
    />
  );
}
