"use client";

import { AlertTriangle, Calculator, Clock, Receipt, Percent, BarChart3, Users } from "lucide-react";
import { formatFCFA } from "@/lib/calculations/money";

export default function LandingFeatures() {
  return (
    <section className="py-24 bg-white dark:bg-slate-900" id="features">
      <div className="container mx-auto px-6 max-w-7xl space-y-20">
        
        {/* Why change habits (Problem Cards) */}
        <div className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Pourquoi changer vos habitudes ?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Les méthodes traditionnelles vous font perdre du temps et de l&apos;argent. proFacture résout vos problèmes quotidiens.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="glass-card rounded-2xl p-6 ambient-shadow hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-6">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Manque de professionnalisme
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Des factures mal formatées donnent une mauvaise image à vos clients et retardent souvent les paiements.
              </p>
            </div>

            {/* Card 2 */}
            <div className="glass-card rounded-2xl p-6 ambient-shadow hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 flex items-center justify-center mb-6">
                <Calculator className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Calculs manuels complexes
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Gérer la TVA à 18% ou les retenues à la source manuellement entraîne souvent des erreurs de calcul coûteuses.
              </p>
            </div>

            {/* Card 3 */}
            <div className="glass-card rounded-2xl p-6 ambient-shadow hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Suivi des paiements chaotique
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Oublier de relancer un client ou ne pas savoir qui vous doit quoi affecte directement la trésorerie de votre entreprise.
              </p>
            </div>
          </div>
        </div>

        {/* Feature List + Abstract UI representation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center pt-8 border-t border-slate-100 dark:border-slate-800/40">
          
          {/* Left Side: Bullet Features */}
          <div className="space-y-8">
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Tout ce dont vous avez besoin pour gérer vos finances
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                Une suite d&apos;outils conçue spécifiquement pour les réalités des entrepreneurs en Afrique.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Feature 1 */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                  <Receipt className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Facturation en 2 clics</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-normal">Créez et envoyez des factures élégantes en quelques secondes depuis n&apos;importe quel appareil.</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                  <Percent className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">TVA 18% Automatique</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-normal">Les taxes locales UEMOA sont calculées automatiquement, fini les erreurs de calcul.</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Suivi en temps réel</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-normal">Sachez instantanément quand vos factures sont payées ou en retard.</p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Gestion des clients</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-normal">Un répertoire de clients intégré pour retrouver facilement les informations de vos contacts.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Abstract UI Invoice Cards */}
          <div className="glass-card rounded-3xl p-6 ambient-shadow space-y-4 max-w-md mx-auto w-full select-none pointer-events-none">
            <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded w-1/3 mb-6" />
            
            {/* Invoice 1: Paid */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex justify-between items-center shadow-xs">
              <div className="flex gap-3 items-center">
                <div className="w-8 h-8 bg-indigo-50 dark:bg-indigo-950/35 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xs">
                  A
                </div>
                <div>
                  <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-20 mb-1.5" />
                  <div className="h-2.5 bg-slate-100 dark:bg-slate-850 rounded w-12" />
                </div>
              </div>
              <div className="text-right space-y-1">
                <div className="text-xs font-extrabold text-emerald-600 font-mono">{formatFCFA(500000)}</div>
                <div className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full inline-block">Payée</div>
              </div>
            </div>

            {/* Invoice 2: Overdue */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex justify-between items-center shadow-xs">
              <div className="flex gap-3 items-center">
                <div className="w-8 h-8 bg-indigo-50 dark:bg-indigo-950/35 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xs">
                  B
                </div>
                <div>
                  <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-24 mb-1.5" />
                  <div className="h-2.5 bg-slate-100 dark:bg-slate-850 rounded w-16" />
                </div>
              </div>
              <div className="text-right space-y-1">
                <div className="text-xs font-extrabold text-slate-800 dark:text-slate-350 font-mono">{formatFCFA(1200000)}</div>
                <div className="text-[9px] font-bold text-rose-700 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full inline-block">En retard</div>
              </div>
            </div>

            {/* Invoice 3: Draft */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex justify-between items-center opacity-60 shadow-xs">
              <div className="flex gap-3 items-center">
                <div className="w-8 h-8 bg-indigo-50 dark:bg-indigo-950/35 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xs">
                  C
                </div>
                <div>
                  <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-16 mb-1.5" />
                  <div className="h-2.5 bg-slate-100 dark:bg-slate-850 rounded w-10" />
                </div>
              </div>
              <div className="text-right space-y-1">
                <div className="text-xs font-extrabold text-slate-850 dark:text-slate-350 font-mono">{formatFCFA(250000)}</div>
                <div className="text-[9px] font-bold text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full inline-block">Brouillon</div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
