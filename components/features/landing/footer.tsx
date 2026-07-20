"use client";

import Link from "next/link";
import { FileText, Mail, Globe } from "lucide-react";

export default function LandingFooter() {
  return (
    <footer className="w-full bg-slate-50 dark:bg-slate-950 border-t border-slate-200/50 dark:border-slate-800/50">
      
      {/* Call to action section inside footer area */}
      <section className="py-20 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 text-white text-center relative overflow-hidden border-y border-slate-900">
        <div className="absolute inset-0 bg-indigo-500/[0.03] pointer-events-none bg-grid-pattern" />
        <div className="container mx-auto px-6 max-w-4xl relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Prêt à simplifier votre facturation ?
          </h2>
          <p className="text-sm sm:text-base text-slate-350 max-w-2xl mx-auto leading-relaxed">
            Rejoignez la nouvelle génération d&apos;entrepreneurs africains qui gagnent du temps chaque jour avec appFacture.
          </p>
          <div className="pt-4">
            <Link
              href="/dashboard"
              className="cta-primary inline-flex items-center justify-center gap-2 rounded-full bg-white text-slate-950 px-8 py-4 text-sm font-bold shadow-xl hover:bg-slate-50 transition-all"
            >
              Créer un compte gratuit
            </Link>
          </div>
        </div>
      </section>

      {/* Main Footer Links Block */}
      <div className="py-16 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 font-medium text-xs text-slate-650 dark:text-slate-400">
        
        {/* Brand/Copyright info */}
        <div className="space-y-4">
          <Link href="#" className="flex items-center gap-2 text-primary dark:text-white block hover:opacity-90 transition-opacity">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 shadow-sm">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-bold text-slate-800 dark:text-white font-headline-lg">
              appFacture
            </span>
          </Link>
          <p className="text-[10px] text-slate-450 dark:text-slate-500 leading-normal">
            © 2026 appFacture. Fait avec fierté en Afrique.<br />
            Tous droits réservés.
          </p>
          <div className="flex gap-3 pt-2">
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors" title="Site Web">
              <Globe className="h-4 w-4" />
            </a>
            <a href="mailto:contact@appfacture.com" className="text-slate-400 hover:text-indigo-600 transition-colors" title="Contact Email">
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Product links */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Produit</h4>
          <ul className="space-y-2">
            <li>
              <a href="#features" className="hover:text-indigo-650 transition-colors">Fonctionnalités</a>
            </li>
            <li>
              <a href="#pricing" className="hover:text-indigo-650 transition-colors">Tarifs</a>
            </li>
            <li>
              <a href="#" className="hover:text-indigo-650 transition-colors">Mises à jour</a>
            </li>
          </ul>
        </div>

        {/* Resources links */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Ressources</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-indigo-650 transition-colors">Blog</a>
            </li>
            <li>
              <a href="#" className="hover:text-indigo-650 transition-colors">Guides d&apos;entrepreneuriat</a>
            </li>
            <li>
              <a href="#" className="hover:text-indigo-650 transition-colors">Modèles de factures</a>
            </li>
          </ul>
        </div>

        {/* Legal & Support links */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Légal & Support</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-indigo-650 transition-colors">Conditions d&apos;utilisation</a>
            </li>
            <li>
              <a href="#" className="hover:text-indigo-650 transition-colors">Politique de confidentialité</a>
            </li>
            <li>
              <a href="#" className="hover:text-indigo-650 transition-colors">Support Technique</a>
            </li>
          </ul>
        </div>

      </div>

    </footer>
  );
}
