"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getGeraetearten,
  createGeraeteart,
  updateGeraeteart,
  deleteGeraeteart,
} from "@/lib/actions/admin";
import { geraeteKeys } from "./use-geraete";

// Query Keys
export const adminGeraeteartenKeys = {
  all: ["admin", "geraetearten"] as const,
  list: () => [...adminGeraeteartenKeys.all, "list"] as const,
};

// Queries
export function useAdminGeraetearten() {
  return useQuery({
    queryKey: adminGeraeteartenKeys.list(),
    queryFn: getGeraetearten,
  });
}

// Mutations
export function useCreateGeraeteart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: { bezeichnung: string }) => createGeraeteart(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminGeraeteartenKeys.all });
      queryClient.invalidateQueries({ queryKey: geraeteKeys.arten() });
    },
  });
}

export function useUpdateGeraeteart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: { bezeichnung: string };
    }) => updateGeraeteart(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminGeraeteartenKeys.all });
      queryClient.invalidateQueries({ queryKey: geraeteKeys.arten() });
      queryClient.invalidateQueries({ queryKey: geraeteKeys.all });
    },
  });
}

export function useDeleteGeraeteart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteGeraeteart(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminGeraeteartenKeys.all });
      queryClient.invalidateQueries({ queryKey: geraeteKeys.arten() });
    },
  });
}
