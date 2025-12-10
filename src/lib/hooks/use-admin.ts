"use client";

import { useUser } from "./use-user";

interface UseAdminReturn {
  isAdmin: boolean;
  isLoading: boolean;
}

export function useAdmin(): UseAdminReturn {
  const { profile, isLoading } = useUser();

  return {
    isAdmin: profile?.rolle === "admin",
    isLoading,
  };
}
