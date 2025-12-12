"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getEinsaetze,
  getEinsatz,
  createEinsatz,
  updateEinsatz,
  beendenEinsatz,
  getAktiveEinsaetze,
} from "@/lib/actions/einsaetze";
import type { EinsatzFormValues, EinsatzBeendenFormValues } from "@/lib/validations/einsatz";
import { geraeteKeys } from "./use-geraete";
import { auftraegeKeys } from "./use-auftraege";

// Query Keys
export const einsaetzeKeys = {
  all: ["einsaetze"] as const,
  lists: () => [...einsaetzeKeys.all, "list"] as const,
  list: () => [...einsaetzeKeys.lists()] as const,
  details: () => [...einsaetzeKeys.all, "detail"] as const,
  detail: (id: string) => [...einsaetzeKeys.details(), id] as const,
  aktive: () => [...einsaetzeKeys.all, "aktive"] as const,
};

// Queries
export function useEinsaetze() {
  return useQuery({
    queryKey: einsaetzeKeys.list(),
    queryFn: getEinsaetze,
  });
}

export function useEinsatz(id: string) {
  return useQuery({
    queryKey: einsaetzeKeys.detail(id),
    queryFn: () => getEinsatz(id),
    enabled: !!id,
  });
}

export function useAktiveEinsaetze() {
  return useQuery({
    queryKey: einsaetzeKeys.aktive(),
    queryFn: getAktiveEinsaetze,
  });
}

// Mutations
export function useCreateEinsatz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: EinsatzFormValues) => createEinsatz(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: einsaetzeKeys.all });
      queryClient.invalidateQueries({ queryKey: geraeteKeys.all });
      queryClient.invalidateQueries({ queryKey: auftraegeKeys.all });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["karte"] });
    },
  });
}

export function useUpdateEinsatz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: EinsatzFormValues }) =>
      updateEinsatz(id, values),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: einsaetzeKeys.all });
      queryClient.invalidateQueries({
        queryKey: einsaetzeKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: geraeteKeys.all });
      queryClient.invalidateQueries({ queryKey: auftraegeKeys.all });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["karte"] });
    },
  });
}

export function useBeendenEinsatz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, values, geraetId }: { id: string; values: EinsatzBeendenFormValues; geraetId: string }) =>
      beendenEinsatz(id, values, geraetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: einsaetzeKeys.all });
      queryClient.invalidateQueries({ queryKey: geraeteKeys.all });
      queryClient.invalidateQueries({ queryKey: auftraegeKeys.all });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["karte"] });
    },
  });
}
