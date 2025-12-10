"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    // Einen einzigen Client für die gesamte Komponente verwenden
    const supabase = createClient();
    let mounted = true;

    async function loadProfile(userId: string) {
      try {
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("id, email, name, rolle, created_at, updated_at")
          .eq("id", userId)
          .single();

        if (error) {
          console.error("Fehler beim Laden des Profils:", error.message, error.details);
          return null;
        }

        return profileData as Profile;
      } catch (error) {
        console.error("Fehler beim Laden des Profils:", error);
        return null;
      }
    }

    async function loadUser() {
      try {
        // Zuerst Session prüfen
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Fehler beim Laden der Session:", sessionError);
          if (mounted) setIsLoading(false);
          return;
        }

        if (!session?.user) {
          // Versuche getUser als Fallback
          const { data: { user: authUser }, error: userError } = await supabase.auth.getUser();

          if (userError || !authUser) {
            if (mounted) setIsLoading(false);
            return;
          }

          if (mounted) {
            setUser(authUser);
            const profileData = await loadProfile(authUser.id);
            if (mounted && profileData) {
              setProfile(profileData);
            }
          }
        } else {
          if (mounted) {
            setUser(session.user);
            const profileData = await loadProfile(session.user.id);
            if (mounted && profileData) {
              setProfile(profileData);
            }
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

      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "INITIAL_SESSION") {
        if (session?.user) {
          setUser(session.user);
          // Kurze Verzögerung um sicherzustellen dass die Session aktiv ist
          await new Promise(resolve => setTimeout(resolve, 100));
          const profileData = await loadProfile(session.user.id);
          if (mounted && profileData) {
            setProfile(profileData);
          }
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { user, profile, isLoading };
}
