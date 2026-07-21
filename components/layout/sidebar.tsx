"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  Wallet,
  FileText,
  PieChart,
  BarChart3,
  HelpCircle,
  Settings,
  Search,
  X,
  ChevronDown,
  Sun,
  Moon,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";
import AuthModal from "./auth-modal";
import SearchModal from "./search-modal";

// Types
interface SidebarLink {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}

const MENU_ITEMS: SidebarLink[] = [
  { label: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
  { label: "Transactions", href: "/transactions", icon: TrendingUp },
  { label: "Portefeuille", href: "/portfolio", icon: Wallet },
  { label: "Factures", href: "/invoices", icon: FileText },
  { label: "Clients", href: "/clients", icon: Users },
  { label: "Budgets", href: "/budget", icon: PieChart },
  { label: "Rapports", href: "/reports", icon: BarChart3 }
];

const BOTTOM_ITEMS: SidebarLink[] = [
  { label: "Aide & Support", href: "/support", icon: HelpCircle },
  { label: "Paramètres", href: "/settings", icon: Settings }
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const theme = useAppStore((state) => state.theme);
  const toggleTheme = useAppStore((state) => state.toggleTheme);
  const user = useAppStore((state) => state.user);
  const signOut = useAppStore((state) => state.signOut);
  const listenToAuthChanges = useAppStore((state) => state.listenToAuthChanges);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowLogoutMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    listenToAuthChanges();
  }, [listenToAuthChanges]);

  useEffect(() => {
    const handleGlobalSearchShortcut = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "f")) {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
    };
    window.addEventListener("keydown", handleGlobalSearchShortcut);
    return () => window.removeEventListener("keydown", handleGlobalSearchShortcut);
  }, []);

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white border-r border-slate-200/80 p-6 transition-transform lg:translate-x-0 lg:static lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Top Header & Close button for mobile */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/dashboard" className="flex items-center gap-2.5" onClick={onClose}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 shadow-sm shadow-indigo-200">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              proFacture
            </span>
          </Link>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
            aria-label="Fermer le menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Global Search (Interactive modal trigger) */}
        <div className="relative mb-6 cursor-pointer" onClick={() => setIsSearchModalOpen(true)}>
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4.5 w-4.5 text-slate-400" />
          </div>
          <div className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-12 text-sm text-slate-400 select-none">
            Rechercher...
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded border border-slate-200 bg-white px-1.5 font-mono text-[10px] font-medium text-slate-400">
              ⌘F
            </kbd>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 space-y-7 overflow-y-auto pr-1">
          <div>
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Menu principal
            </p>
            <nav className="space-y-1">
              {MENU_ITEMS.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <div key={item.label}>
                    {item.disabled ? (
                      <div
                        className="flex items-center justify-between rounded-xl px-3 py-2.5 text-slate-400 cursor-not-allowed group hover:bg-slate-50/50 transition-all"
                        title="Bientôt disponible"
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="h-5 w-5 text-slate-350" />
                          <span className="text-[14px] font-medium">{item.label}</span>
                        </div>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                          Bientôt
                        </span>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-all duration-200",
                          isActive
                            ? "bg-indigo-50 text-indigo-600"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        )}
                      >
                        <item.icon
                          className={cn(
                            "h-5 w-5 transition-colors",
                            isActive ? "text-indigo-600" : "text-slate-450 group-hover:text-slate-900"
                          )}
                        />
                        <span>{item.label}</span>
                      </Link>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          <div>
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Support & Configuration
            </p>
            <nav className="space-y-1">
              {BOTTOM_ITEMS.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <div key={item.label}>
                    {item.disabled ? (
                      <div
                        className="flex items-center justify-between rounded-xl px-3 py-2.5 text-slate-400 cursor-not-allowed hover:bg-slate-50/50 transition-all"
                        title="Bientôt disponible"
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="h-5 w-5 text-slate-350" />
                          <span className="text-[14px] font-medium">{item.label}</span>
                        </div>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-all duration-200",
                          isActive
                            ? "bg-indigo-50 text-indigo-600"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        )}
                      >
                        <item.icon
                          className={cn(
                            "h-5 w-5 transition-colors",
                            isActive ? "text-indigo-600" : "text-slate-450 group-hover:text-slate-900"
                          )}
                        />
                        <span>{item.label}</span>
                      </Link>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Theme Mode Toggle */}
        <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Mode Sombre</span>
          <div className="flex p-0.5 rounded-lg bg-slate-100 gap-0.5">
            <button
              onClick={() => theme === "dark" && toggleTheme()}
              className={cn(
                "p-1.5 rounded-md transition-all",
                theme === "light"
                  ? "bg-white shadow-xs text-indigo-600"
                  : "text-slate-400 hover:text-slate-700"
              )}
              title="Mode Clair"
            >
              <Sun className="h-4 w-4" />
            </button>
            <button
              onClick={() => theme === "light" && toggleTheme()}
              className={cn(
                "p-1.5 rounded-md transition-all",
                theme === "dark"
                  ? "bg-white shadow-xs text-indigo-600"
                  : "text-slate-400 hover:text-slate-700"
              )}
              title="Mode Sombre"
            >
              <Moon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Organization / Profile Section */}
        <div ref={menuRef} className="relative mt-4">
          {showLogoutMenu && user && (
            <div className="absolute bottom-full left-0 mb-2 w-full rounded-xl border border-slate-200/80 bg-white p-1.5 shadow-lg z-20">
              <button
                onClick={async () => {
                  setShowLogoutMenu(false);
                  try {
                    await signOut();
                    toast.success("Déconnexion réussie !");
                  } catch (err: any) {
                    toast.error("Erreur lors de la déconnexion.");
                  }
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
              >
                Se déconnecter
              </button>
            </div>
          )}

          <button
            onClick={() => {
              if (user) {
                setShowLogoutMenu(!showLogoutMenu);
              } else {
                setIsAuthModalOpen(true);
              }
            }}
            className="w-full flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3 hover:bg-slate-100/70 transition-colors outline-none"
          >
            <div className="flex items-center gap-3 text-left">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 font-bold text-sm select-none">
                {user 
                  ? (user.name 
                      ? user.name.trim().split(/\s+/).map((n: string) => n[0]).join("").substring(0, 2).toUpperCase() 
                      : user.email.substring(0, 2).toUpperCase()) 
                  : "KC"}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[150px]">
                  {user ? (user.name || user.email) : "Kekeli C."}
                </p>
                <p className="text-[10px] text-slate-500">
                  {user ? "Administrateur" : "Se connecter (Invité)"}
                </p>
              </div>
            </div>
            {user && <ChevronDown className="h-4 w-4 text-slate-400" />}
          </button>
        </div>

        {/* Auth modal overlay */}
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

        {/* Search modal overlay */}
        <SearchModal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} />
      </aside>
    </>
  );
}
