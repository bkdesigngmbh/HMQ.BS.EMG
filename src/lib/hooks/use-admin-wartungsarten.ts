"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getWartungsarten,
  createWartungsart,
  updateWartungsart,
  deleteWartungsart,
} from "@/lib/actions/admin";
import { wartungenKeys } from "./use-wartungen";

// Query Keys
export const adminWartungsartenKeys = {
  all: ["admin", "wartungsarten"] as const,
  list: () => [...adminWartungsartenKeys.all, "list"] as const,
};

// Queries
export function useAdminWartungsarten() {
  return useQuery({
    queryKey: adminWartungsartenKeys.list(),
    queryFn: getWartungsarten,
  });
}

// Mutations
export function useCreateWartungsart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: { bezeichnung: string }) => createWartungsart(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminWartungsartenKeys.all });
      queryClient.invalidateQueries({ queryKey: wartungenKeys.arten() });
    },
  });
}

export function useUpdateWartungsart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: { bezeichnung: string };
    }) => updateWartungsart(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminWartungsartenKeys.all });
      queryClient.invalidateQueries({ queryKey: wartungenKeys.arten() });
    },
  });
}

export function useDeleteWartungsart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteWartungsart(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminWartungsartenKeys.all });
      queryClient.invalidateQueries({ queryKey: wartungenKeys.arten() });
    },
  });
}
