"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/sidebar";
import Topbar from "@/components/layout/topbar";
import FullscreenAuth from "@/components/layout/fullscreen-auth";
import { useAppStore } from "@/lib/store";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isLoading = useAppStore((state) => state.isLoading);
  const user = useAppStore((state) => state.user);
  const listenToAuthChanges = useAppStore((state) => state.listenToAuthChanges);

  useEffect(() => {
    listenToAuthChanges();
  }, [listenToAuthChanges]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 animate-pulse">Chargement des données...</p>
        </div>
      </div>
    );
  }

  // Auth Guard: Block access if not authenticated
  if (!user) {
    return <FullscreenAuth />;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Pane */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Navigation Bar */}
        <Topbar onOpenSidebar={() => setSidebarOpen(true)} />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
