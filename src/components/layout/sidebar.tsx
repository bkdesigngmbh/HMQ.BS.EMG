"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LayoutDashboard,
  Box,
  FileText,
  Calendar,
  Map,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  Menu,
  X,
} from "lucide-react";

const SIDEBAR_COLLAPSED_KEY = "sidebar-collapsed";

// Profil-Typ für die Props
interface Profile {
  id: string;
  email: string;
  name: string | null;
  rolle: "admin" | "user";
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Geräte",
    href: "/geraete",
    icon: Box,
  },
  {
    title: "Aufträge",
    href: "/auftraege",
    icon: FileText,
  },
  {
    title: "Einsätze",
    href: "/einsaetze",
    icon: Calendar,
  },
  {
    title: "Karte",
    href: "/karte",
    icon: Map,
  },
];

const adminItems: NavItem[] = [
  {
    title: "Admin",
    href: "/admin",
    icon: Settings,
    adminOnly: true,
  },
];

interface SidebarProps {
  profile: Profile; // Nicht nullable - Layout redirected wenn kein Profil
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ profile, isMobileOpen, onMobileClose }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Admin-Check basierend auf dem serverseitig geladenen Profil
  const isAdmin = profile.rolle === "admin";

  useEffect(() => {
    const saved = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    if (saved !== null) {
      setIsCollapsed(JSON.parse(saved));
    }
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    onMobileClose?.();
  }, [pathname, onMobileClose]);

  const toggleCollapsed = () => {
    const newValue = !isCollapsed;
    setIsCollapsed(newValue);
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, JSON.stringify(newValue));
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <TooltipProvider delayDuration={0}>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen border-r bg-background transition-all duration-300 ease-in-out",
          // Desktop
          "hidden md:block",
          isCollapsed ? "md:w-[70px]" : "md:w-[250px]",
          // Mobile
          isMobileOpen && "block w-[280px] animate-slide-in-left"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo/Header */}
          <div
            className={cn(
              "flex h-16 items-center border-b px-4",
              isCollapsed && !isMobileOpen ? "justify-center" : "justify-between"
            )}
          >
            {(!isCollapsed || isMobileOpen) && (
              <Link href="/" className="flex items-center gap-2">
                <span className="text-lg font-bold text-primary">HMQ - EMG</span>
              </Link>
            )}
            {/* Desktop collapse button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCollapsed}
              className="hidden h-8 w-8 md:flex"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
            {/* Mobile close button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onMobileClose}
              className="h-8 w-8 md:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  isActive={isActive(item.href)}
                  isCollapsed={isCollapsed && !isMobileOpen}
                />
              ))}

              {isAdmin && (
                <>
                  <Separator className="my-4" />
                  {adminItems.map((item) => (
                    <NavLink
                      key={item.href}
                      item={item}
                      isActive={isActive(item.href)}
                      isCollapsed={isCollapsed && !isMobileOpen}
                    />
                  ))}
                </>
              )}
            </nav>
          </ScrollArea>

          {/* User Section */}
          <div className="border-t p-4">
            {isCollapsed && !isMobileOpen ? (
              <div className="flex flex-col items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{profile.name || profile.email}</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleLogout}
                      className="h-10 w-10 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <LogOut className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Abmelden</TooltipContent>
                </Tooltip>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-medium">
                      {profile.name || "Benutzer"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {profile.email}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full justify-start hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Abmelden
                </Button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
}

interface NavLinkProps {
  item: NavItem;
  isActive: boolean;
  isCollapsed: boolean;
}

function NavLink({ item, isActive, isCollapsed }: NavLinkProps) {
  const Icon = item.icon;

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={item.href}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-md mx-auto transition-all duration-200",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "hover:bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-5 w-5" />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{item.title}</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 transition-all duration-200",
        isActive
          ? "bg-primary text-primary-foreground shadow-sm border-l-4 border-primary-foreground/30"
          : "hover:bg-muted text-muted-foreground hover:text-foreground"
      )}
    >
      <Icon className="h-5 w-5" />
      <span className="font-medium">{item.title}</span>
    </Link>
  );
}

// Mobile header component for hamburger menu
interface MobileHeaderProps {
  onMenuClick: () => void;
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 md:hidden">
      <Button variant="ghost" size="icon" onClick={onMenuClick}>
        <Menu className="h-6 w-6" />
      </Button>
      <span className="text-lg font-bold text-primary">HMQ - EMG</span>
      <div className="w-10" /> {/* Spacer for centering */}
    </header>
  );
}
