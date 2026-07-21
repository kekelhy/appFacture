"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, Bell, ChevronDown } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";
import AuthModal from "./auth-modal";

interface TopbarProps {
  onOpenSidebar: () => void;
}

export default function Topbar({ onOpenSidebar }: TopbarProps) {
  const pathname = usePathname();
  const user = useAppStore((state) => state.user);
  const signOut = useAppStore((state) => state.signOut);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);

  // Déterminer le titre de la section courante
  const getSectionTitle = () => {
    if (pathname.startsWith("/invoices")) return "Factures";
    if (pathname.startsWith("/clients")) return "Clients";
    if (pathname.startsWith("/settings")) return "Paramètres";
    if (pathname.startsWith("/reports")) return "Rapports";
    if (pathname.startsWith("/transactions")) return "Transactions";
    if (pathname.startsWith("/portfolio")) return "Portefeuille";
    if (pathname.startsWith("/budget")) return "Budgets";
    return "Tableau de bord";
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/60 bg-white/70 backdrop-blur-md px-6 lg:px-8">
      <div className="flex items-center gap-4">
        {/* Hamburger Menu Trigger for Mobile */}
        <button
          onClick={onOpenSidebar}
          className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 lg:hidden transition-colors"
          aria-label="Ouvrir le menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        {/* Screen Title */}
        <h1 className="text-base font-bold text-slate-800 tracking-tight sm:text-lg">
          {getSectionTitle()}
        </h1>
      </div>

      {/* Action Items */}
      <div className="flex items-center gap-3">
        {/* Notifications (Static/Disabled) */}
        <button 
          className="relative rounded-xl p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all cursor-not-allowed" 
          disabled
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-indigo-600" />
        </button>
        
        <div className="h-4 w-px bg-slate-200" />
        
        {/* User Info */}
        <div className="relative">
          {showLogoutMenu && user && (
            <>
              <div onClick={() => setShowLogoutMenu(false)} className="fixed inset-0 z-10" />
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200/80 bg-white p-1.5 shadow-lg z-20">
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
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  Se déconnecter
                </button>
              </div>
            </>
          )}

          <button
            onClick={() => {
              if (user) {
                setShowLogoutMenu(!showLogoutMenu);
              } else {
                setIsAuthModalOpen(true);
              }
            }}
            className="flex items-center gap-2 hover:bg-slate-50 p-1.5 rounded-xl transition-colors outline-none"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-55 border border-indigo-100 text-indigo-650 font-bold text-xs">
              {user 
                ? (user.name 
                    ? user.name.trim().split(/\s+/).map((n: string) => n[0]).join("").substring(0, 2).toUpperCase() 
                    : user.email.substring(0, 2).toUpperCase()) 
                : "KC"}
            </div>
            <span className="hidden sm:inline text-xs font-semibold text-slate-700 truncate max-w-[120px]">
              {user ? (user.name || user.email) : "Kekeli C."}
            </span>
            {user && <ChevronDown className="h-3.5 w-3.5 text-slate-400" />}
          </button>
        </div>
      </div>

      {/* Auth modal overlay */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  );
}
