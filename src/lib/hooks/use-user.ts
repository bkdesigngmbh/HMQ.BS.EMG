"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/types/database";

interface UseUserReturn {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
}

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = useCallback(async (userId: string) => {
    const supabase = createClient();

    try {
      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Fehler beim Laden des Profils:", error);
        return null;
      }

      return profileData;
    } catch (error) {
      console.error("Fehler beim Laden des Profils:", error);
      return null;
    }
  }, []);

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    async function loadUser() {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          console.error("Fehler beim Laden des Benutzers:", userError);
          if (mounted) {
            setIsLoading(false);
          }
          return;
        }

        if (user && mounted) {
          setUser(user);
          const profileData = await loadProfile(user.id);
          if (mounted) {
            setProfile(profileData);
          }
        }
      } catch (error) {
        console.error("Fehler beim Laden des Benutzers:", error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadUser();

    // Auth State Listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (session?.user) {
        setUser(session.user);
        const profileData = await loadProfile(session.user.id);
        if (mounted) {
          setProfile(profileData);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  return { user, profile, isLoading };
}
