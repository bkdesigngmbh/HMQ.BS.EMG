"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { cn } from "@/lib/utils";

const SIDEBAR_COLLAPSED_KEY = "sidebar-collapsed";

// Profil-Typ für die Props
interface Profile {
  id: string;
  email: string;
  name: string | null;
  rolle: "admin" | "user";
}

interface DashboardShellProps {
  children: React.ReactNode;
  profile: Profile | null;
}

export function DashboardShell({ children, profile }: DashboardShellProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    if (saved !== null) {
      setIsCollapsed(JSON.parse(saved));
    }

    const handleStorageChange = () => {
      const saved = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
      if (saved !== null) {
        setIsCollapsed(JSON.parse(saved));
      }
    };

    window.addEventListener("storage", handleStorageChange);

    const interval = setInterval(() => {
      const saved = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
      if (saved !== null) {
        const newValue = JSON.parse(saved);
        setIsCollapsed((prev) => (prev !== newValue ? newValue : prev));
      }
    }, 100);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-muted/30">
      <Sidebar profile={profile} />
      <main
        className={cn(
          "transition-all duration-300",
          isCollapsed ? "ml-[70px]" : "ml-[250px]"
        )}
      >
        {children}
      </main>
    </div>
  );
}
