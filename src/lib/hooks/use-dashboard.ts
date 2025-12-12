"use client";

import { useQuery } from "@tanstack/react-query";
import { getGeraeteStatistiken } from "@/lib/actions/geraete";
import { getAktiveEinsaetze } from "@/lib/actions/einsaetze";
import { getAktiveAuftraege } from "@/lib/actions/auftraege";
import { getAnstehendeWartungen } from "@/lib/actions/wartungen";

// Query Keys
export const dashboardKeys = {
  all: ["dashboard"] as const,
  statistiken: () => [...dashboardKeys.all, "statistiken"] as const,
  aktiveEinsaetze: () => [...dashboardKeys.all, "aktiveEinsaetze"] as const,
  aktiveAuftraege: () => [...dashboardKeys.all, "aktiveAuftraege"] as const,
  anstehendeWartungen: () => [...dashboardKeys.all, "anstehendeWartungen"] as const,
};

// Queries
export function useDashboardStatistiken() {
  return useQuery({
    queryKey: dashboardKeys.statistiken(),
    queryFn: getGeraeteStatistiken,
  });
}

export function useDashboardAktiveEinsaetze() {
  return useQuery({
    queryKey: dashboardKeys.aktiveEinsaetze(),
    queryFn: getAktiveEinsaetze,
  });
}

export function useDashboardAktiveAuftraege() {
  return useQuery({
    queryKey: dashboardKeys.aktiveAuftraege(),
    queryFn: getAktiveAuftraege,
  });
}

export function useDashboardAnstehendeWartungen() {
  return useQuery({
    queryKey: dashboardKeys.anstehendeWartungen(),
    queryFn: getAnstehendeWartungen,
  });
}

// Combined dashboard data hook
export function useDashboardData() {
  const statistiken = useDashboardStatistiken();
  const aktiveEinsaetze = useDashboardAktiveEinsaetze();
  const aktiveAuftraege = useDashboardAktiveAuftraege();
  const anstehendeWartungen = useDashboardAnstehendeWartungen();

  return {
    statistiken: statistiken.data,
    aktiveEinsaetze: aktiveEinsaetze.data,
    aktiveAuftraege: aktiveAuftraege.data,
    anstehendeWartungen: anstehendeWartungen.data,
    isLoading:
      statistiken.isLoading ||
      aktiveEinsaetze.isLoading ||
      aktiveAuftraege.isLoading ||
      anstehendeWartungen.isLoading,
    error:
      statistiken.error ||
      aktiveEinsaetze.error ||
      aktiveAuftraege.error ||
      anstehendeWartungen.error,
  };
}
