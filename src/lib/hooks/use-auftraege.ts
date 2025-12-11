"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAuftraege,
  getAuftrag,
  createAuftrag,
  updateAuftrag,
  deleteAuftrag,
  getAktiveAuftraege,
} from "@/lib/actions/auftraege";
import type { AuftragFormValues } from "@/lib/validations/auftrag";

// Query Keys
export const auftraegeKeys = {
  all: ["auftraege"] as const,
  lists: () => [...auftraegeKeys.all, "list"] as const,
  list: () => [...auftraegeKeys.lists()] as const,
  details: () => [...auftraegeKeys.all, "detail"] as const,
  detail: (id: string) => [...auftraegeKeys.details(), id] as const,
  aktive: () => [...auftraegeKeys.all, "aktive"] as const,
};

// Queries
export function useAuftraege() {
  return useQuery({
    queryKey: auftraegeKeys.list(),
    queryFn: getAuftraege,
  });
}

export function useAuftrag(id: string) {
  return useQuery({
    queryKey: auftraegeKeys.detail(id),
    queryFn: () => getAuftrag(id),
    enabled: !!id,
  });
}

export function useAktiveAuftraege() {
  return useQuery({
    queryKey: auftraegeKeys.aktive(),
    queryFn: getAktiveAuftraege,
  });
}

// Mutations
export function useCreateAuftrag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: AuftragFormValues) => createAuftrag(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: auftraegeKeys.all });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpdateAuftrag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: AuftragFormValues }) =>
      updateAuftrag(id, values),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: auftraegeKeys.all });
      queryClient.invalidateQueries({
        queryKey: auftraegeKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useDeleteAuftrag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAuftrag(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: auftraegeKeys.all });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
