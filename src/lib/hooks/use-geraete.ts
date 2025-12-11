"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getGeraete,
  getGeraet,
  createGeraet,
  updateGeraet,
  deleteGeraet,
  getGeraetearten,
  getGeraetestatus,
  getVerfuegbareGeraete,
} from "@/lib/actions/geraete";
import type { GeraetFormValues } from "@/lib/validations/geraet";

// Query Keys
export const geraeteKeys = {
  all: ["geraete"] as const,
  lists: () => [...geraeteKeys.all, "list"] as const,
  list: () => [...geraeteKeys.lists()] as const,
  details: () => [...geraeteKeys.all, "detail"] as const,
  detail: (id: string) => [...geraeteKeys.details(), id] as const,
  verfuegbar: () => [...geraeteKeys.all, "verfuegbar"] as const,
  arten: () => ["geraetearten"] as const,
  status: () => ["geraetestatus"] as const,
};

// Queries
export function useGeraete() {
  return useQuery({
    queryKey: geraeteKeys.list(),
    queryFn: getGeraete,
  });
}

export function useGeraet(id: string) {
  return useQuery({
    queryKey: geraeteKeys.detail(id),
    queryFn: () => getGeraet(id),
    enabled: !!id,
  });
}

export function useVerfuegbareGeraete() {
  return useQuery({
    queryKey: geraeteKeys.verfuegbar(),
    queryFn: getVerfuegbareGeraete,
  });
}

export function useGeraetearten() {
  return useQuery({
    queryKey: geraeteKeys.arten(),
    queryFn: getGeraetearten,
  });
}

export function useGeraetestatus() {
  return useQuery({
    queryKey: geraeteKeys.status(),
    queryFn: getGeraetestatus,
  });
}

// Mutations
export function useCreateGeraet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: GeraetFormValues) => createGeraet(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: geraeteKeys.all });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpdateGeraet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: GeraetFormValues }) =>
      updateGeraet(id, values),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: geraeteKeys.all });
      queryClient.invalidateQueries({
        queryKey: geraeteKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useDeleteGeraet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteGeraet(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: geraeteKeys.all });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
