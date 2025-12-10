import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  color?: string;
  className?: string;
}

export function StatusBadge({ status, color, className }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn("font-normal", className)}
      style={color ? { borderColor: color, color: color } : undefined}
    >
      {status}
    </Badge>
  );
}

interface AuftragStatusBadgeProps {
  status: "offen" | "aktiv" | "abgeschlossen";
}

export function AuftragStatusBadge({ status }: AuftragStatusBadgeProps) {
  const statusConfig = {
    offen: { label: "Offen", variant: "outline" as const },
    aktiv: { label: "Aktiv", variant: "default" as const },
    abgeschlossen: { label: "Abgeschlossen", variant: "secondary" as const },
  };

  const config = statusConfig[status];

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
