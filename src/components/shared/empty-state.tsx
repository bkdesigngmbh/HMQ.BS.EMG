import { cn } from "@/lib/utils";
import {
  Inbox,
  Box,
  FileText,
  Calendar,
  Wrench,
  Search,
  LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  children,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-fade-in",
        className
      )}
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        {icon || <Inbox className="h-6 w-6 text-muted-foreground" />}
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      )}
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}

interface SpecificEmptyStateProps {
  onAction?: () => void;
  actionLabel?: string;
  className?: string;
}

const emptyStateConfig: Record<
  string,
  { title: string; description: string; icon: LucideIcon; actionLabel: string }
> = {
  geraete: {
    title: "Keine Geräte vorhanden",
    description:
      "Es wurden noch keine Erschütterungsmessgeräte erfasst. Erstellen Sie ein neues Gerät, um zu beginnen.",
    icon: Box,
    actionLabel: "Neues Gerät",
  },
  auftraege: {
    title: "Keine Aufträge vorhanden",
    description:
      "Es wurden noch keine Aufträge erfasst. Erstellen Sie einen neuen Auftrag, um zu beginnen.",
    icon: FileText,
    actionLabel: "Neuer Auftrag",
  },
  einsaetze: {
    title: "Keine Einsätze vorhanden",
    description:
      "Es wurden noch keine Einsätze erfasst. Erstellen Sie einen neuen Einsatz, um zu beginnen.",
    icon: Calendar,
    actionLabel: "Neuer Einsatz",
  },
  wartungen: {
    title: "Keine Wartungen vorhanden",
    description:
      "Es wurden noch keine Wartungen erfasst. Erfassen Sie eine neue Wartung, um zu beginnen.",
    icon: Wrench,
    actionLabel: "Neue Wartung",
  },
  suchergebnisse: {
    title: "Keine Suchergebnisse",
    description:
      "Es wurden keine Einträge gefunden, die Ihrer Suche entsprechen. Versuchen Sie es mit anderen Suchbegriffen.",
    icon: Search,
    actionLabel: "Filter zurücksetzen",
  },
};

function createEmptyStateComponent(type: keyof typeof emptyStateConfig) {
  const config = emptyStateConfig[type];
  const Icon = config.icon;

  return function SpecificEmptyState({
    onAction,
    actionLabel,
    className,
  }: SpecificEmptyStateProps) {
    return (
      <EmptyState
        title={config.title}
        description={config.description}
        icon={<Icon className="h-6 w-6 text-muted-foreground" />}
        className={className}
      >
        {onAction && (
          <Button onClick={onAction}>{actionLabel || config.actionLabel}</Button>
        )}
      </EmptyState>
    );
  };
}

export const GeraeteEmptyState = createEmptyStateComponent("geraete");
export const AuftraegeEmptyState = createEmptyStateComponent("auftraege");
export const EinsaetzeEmptyState = createEmptyStateComponent("einsaetze");
export const WartungenEmptyState = createEmptyStateComponent("wartungen");
export const SuchergebnisseEmptyState = createEmptyStateComponent("suchergebnisse");
