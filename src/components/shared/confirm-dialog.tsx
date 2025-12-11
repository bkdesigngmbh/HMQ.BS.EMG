"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LoadingSpinner } from "./loading-spinner";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;
  variant?: "default" | "destructive";
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Bestätigen",
  cancelLabel = "Abbrechen",
  onConfirm,
  isLoading = false,
  variant = "default",
}: ConfirmDialogProps) {
  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className={cn(
              variant === "destructive" &&
                "bg-destructive text-destructive-foreground hover:bg-destructive/90"
            )}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <LoadingSpinner size="sm" className="text-current" />
                {confirmLabel}
              </span>
            ) : (
              confirmLabel
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Pre-configured delete confirmation dialog
interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemName?: string;
  itemType?: string;
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  itemName,
  itemType = "Eintrag",
  onConfirm,
  isLoading = false,
}: DeleteConfirmDialogProps) {
  const title = itemName
    ? `${itemType} "${itemName}" löschen?`
    : `${itemType} löschen?`;
  const description = itemName
    ? `Möchten Sie ${itemType.toLowerCase()} "${itemName}" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.`
    : `Möchten Sie diesen ${itemType.toLowerCase()} wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.`;

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      confirmLabel="Löschen"
      cancelLabel="Abbrechen"
      onConfirm={onConfirm}
      isLoading={isLoading}
      variant="destructive"
    />
  );
}
