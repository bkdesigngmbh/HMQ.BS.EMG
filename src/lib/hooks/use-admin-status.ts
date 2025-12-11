"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getGeraetestatus,
  createGeraetestatus,
  updateGeraetestatus,
  deleteGeraetestatus,
} from "@/lib/actions/admin";
import { geraeteKeys } from "./use-geraete";

// Query Keys
export const adminStatusKeys = {
  all: ["admin", "status"] as const,
  list: () => [...adminStatusKeys.all, "list"] as const,
};

// Queries
export function useAdminStatus() {
  return useQuery({
    queryKey: adminStatusKeys.list(),
    queryFn: getGeraetestatus,
  });
}

// Mutations
export function useCreateStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: { bezeichnung: string; farbe: string }) =>
      createGeraetestatus(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminStatusKeys.all });
      queryClient.invalidateQueries({ queryKey: geraeteKeys.status() });
    },
  });
}

export function useUpdateStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: { bezeichnung: string; farbe: string };
    }) => updateGeraetestatus(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminStatusKeys.all });
      queryClient.invalidateQueries({ queryKey: geraeteKeys.status() });
      queryClient.invalidateQueries({ queryKey: geraeteKeys.all });
    },
  });
}

export function useDeleteStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteGeraetestatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminStatusKeys.all });
      queryClient.invalidateQueries({ queryKey: geraeteKeys.status() });
    },
  });
}
