"use client";

import Link from "next/link";
import { ArrowRight, Bolt, FileText, Smartphone, TrendingUp } from "lucide-react";

export default function LandingHero() {
  return (
    <section className="relative pt-20 pb-28 overflow-hidden bg-grid-pattern">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 via-slate-50/90 to-slate-50 z-0 dark:from-slate-950/20 dark:via-slate-950/80 dark:to-slate-950"></div>
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10 text-center reveal active">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* New Analytics Tag */}
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold shadow-xs animate-pulse-soft">
            <Bolt className="h-4 w-4 text-indigo-600 fill-indigo-100" />
            Nouveau : Analyse de Trésorerie & Budgets
          </span>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Fini les factures sur Word et Excel.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-800">
              Passez à la vitesse supérieure.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-650 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            La solution de facturation la plus simple pour les entrepreneurs africains. Créez des factures professionnelles, suivez vos paiements et gérez votre budget en un clin d&apos;œil.
          </p>

          {/* Call to action */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/dashboard"
              className="cta-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-8 py-4 text-sm font-bold text-white shadow-lg hover:bg-indigo-700 transition-all"
            >
              Créer ma première facture
              <ArrowRight className="h-4.5 w-4.5" />
            </Link>
          </div>
        </div>

        {/* Dashboard Mockup with Floating Micro-animated Icons */}
        <div className="mt-16 relative max-w-4xl mx-auto reveal active">
          {/* Blur background glow */}
          <div className="absolute -inset-4 bg-indigo-500/10 rounded-3xl blur-3xl -z-10 dark:bg-indigo-500/5"></div>
          
          {/* Mockup Frame */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-2xl overflow-hidden">
            <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-1 overflow-hidden">
              <img
                src="/app-mockup.png"
                alt="Tableau de bord de appFacture"
                className="w-full h-auto rounded-lg object-cover shadow-sm"
              />
            </div>
          </div>

          {/* Floating animated icons */}
          <div className="absolute -top-6 -left-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-3 rounded-2xl shadow-lg animate-float-1 hidden sm:block">
            <FileText className="h-6 w-6 text-indigo-600" />
          </div>
          <div className="absolute -bottom-6 -right-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-3 rounded-2xl shadow-lg animate-float-2 hidden sm:block">
            <Smartphone className="h-6 w-6 text-sky-500" />
          </div>
          <div className="absolute top-1/2 -right-10 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-3 rounded-2xl shadow-lg animate-float-3 hidden sm:block">
            <TrendingUp className="h-6 w-6 text-emerald-600" />
          </div>
        </div>
      </div>
    </section>
  );
}
