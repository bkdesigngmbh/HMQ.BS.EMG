"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getWartungen,
  getWartung,
  createWartung,
  updateWartung,
  deleteWartung,
  getWartungenByGeraet,
  getWartungsarten,
  getAnstehendeWartungen,
} from "@/lib/actions/wartungen";
import type { WartungFormValues } from "@/lib/validations/wartung";
import { geraeteKeys } from "./use-geraete";

// Query Keys
export const wartungenKeys = {
  all: ["wartungen"] as const,
  lists: () => [...wartungenKeys.all, "list"] as const,
  list: () => [...wartungenKeys.lists()] as const,
  details: () => [...wartungenKeys.all, "detail"] as const,
  detail: (id: string) => [...wartungenKeys.details(), id] as const,
  byGeraet: (geraetId: string) => [...wartungenKeys.all, "byGeraet", geraetId] as const,
  anstehend: () => [...wartungenKeys.all, "anstehend"] as const,
  arten: () => ["wartungsarten"] as const,
};

// Queries
export function useWartungen() {
  return useQuery({
    queryKey: wartungenKeys.list(),
    queryFn: getWartungen,
  });
}

export function useWartung(id: string) {
  return useQuery({
    queryKey: wartungenKeys.detail(id),
    queryFn: () => getWartung(id),
    enabled: !!id,
  });
}

export function useWartungenByGeraet(geraetId: string) {
  return useQuery({
    queryKey: wartungenKeys.byGeraet(geraetId),
    queryFn: () => getWartungenByGeraet(geraetId),
    enabled: !!geraetId,
  });
}

export function useAnstehendeWartungen() {
  return useQuery({
    queryKey: wartungenKeys.anstehend(),
    queryFn: getAnstehendeWartungen,
  });
}

export function useWartungsarten() {
  return useQuery({
    queryKey: wartungenKeys.arten(),
    queryFn: getWartungsarten,
  });
}

// Mutations
export function useCreateWartung() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: WartungFormValues) => createWartung(values),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: wartungenKeys.all });
      queryClient.invalidateQueries({ queryKey: geraeteKeys.all });
      queryClient.invalidateQueries({
        queryKey: geraeteKeys.detail(variables.geraet_id),
      });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpdateWartung() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: WartungFormValues }) =>
      updateWartung(id, values),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: wartungenKeys.all });
      queryClient.invalidateQueries({
        queryKey: wartungenKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: geraeteKeys.all });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useDeleteWartung() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, geraetId }: { id: string; geraetId: string }) =>
      deleteWartung(id, geraetId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: wartungenKeys.all });
      queryClient.invalidateQueries({ queryKey: geraeteKeys.all });
      queryClient.invalidateQueries({
        queryKey: geraeteKeys.detail(variables.geraetId),
      });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
