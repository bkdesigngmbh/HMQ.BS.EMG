"use client";

import { useState, useEffect, useCallback } from "react";
import { Sidebar, MobileHeader } from "@/components/layout/sidebar";
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
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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

  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMobileClose = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  const handleMobileOpen = useCallback(() => {
    setIsMobileOpen(true);
  }, []);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Header */}
      <MobileHeader onMenuClick={handleMobileOpen} />

      {/* Sidebar */}
      <Sidebar profile={profile} isMobileOpen={isMobileOpen} onMobileClose={handleMobileClose} />

      {/* Main Content */}
      <main
        className={cn(
          "transition-all duration-300",
          // Desktop sidebar margin
          "md:ml-[70px]",
          !isCollapsed && "md:ml-[250px]",
          // Mobile top padding for fixed header
          "pt-16 md:pt-0"
        )}
      >
        {children}
      </main>
    </div>
  );
}
