"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { cn } from "@/lib/utils";

const SIDEBAR_COLLAPSED_KEY = "sidebar-collapsed";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    if (saved !== null) {
      setIsCollapsed(JSON.parse(saved));
    }

    // Listen for changes to localStorage
    const handleStorageChange = () => {
      const saved = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
      if (saved !== null) {
        setIsCollapsed(JSON.parse(saved));
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Also check periodically for same-tab changes
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
      <Sidebar />
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
