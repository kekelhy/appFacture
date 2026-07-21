"use client";

import Link from "next/link";
import { CheckCircle, ChevronRight } from "lucide-react";
import { formatFCFA } from "@/lib/calculations/money";
import { cn } from "@/lib/utils";

interface PlanFeature {
  text: string;
}

interface PricingPlan {
  name: string;
  price: number;
  period: string;
  description: string;
  features: PlanFeature[];
  popular?: boolean;
  ctaText: string;
  ctaLink: string;
}

const PRICING_PLANS: PricingPlan[] = [
  {
    name: "Gratuit",
    price: 0,
    period: "mois",
    description: "Pour démarrer sereinement",
    ctaText: "Commencer",
    ctaLink: "/dashboard",
    features: [
      { text: "Jusqu'à 5 factures / mois" },
      { text: "Gestion de 5 clients max" },
      { text: "Modèle de facture standard" }
    ]
  },
  {
    name: "Pro",
    price: 5000,
    popular: true,
    period: "mois",
    description: "Pour les indépendants actifs",
    ctaText: "Choisir Pro",
    ctaLink: "/dashboard",
    features: [
      { text: "Factures illimitées" },
      { text: "Clients illimités" },
      { text: "Modèles personnalisables" },
      { text: "Relances automatiques" }
    ]
  },
  {
    name: "Business",
    price: 15000,
    period: "mois",
    description: "Pour les petites équipes",
    ctaText: "Contacter les ventes",
    ctaLink: "/dashboard",
    features: [
      { text: "Tout de l'offre Pro" },
      { text: "Accès multi-utilisateurs (3)" },
      { text: "Export comptable avancé" },
      { text: "Support prioritaire" }
    ]
  }
];

export default function LandingPricing() {
  return (
    <section className="py-24 bg-white dark:bg-slate-900" id="pricing">
      <div className="container mx-auto px-6 max-w-7xl space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 reveal active">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Des tarifs transparents, sans surprise
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Choisissez le plan qui correspond à la taille de votre activité.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
          {PRICING_PLANS.map((plan, idx) => (
            <div
              key={idx}
              className={cn(
                "rounded-3xl p-8 flex flex-col justify-between h-[420px] transition-all duration-350 relative border shadow-sm",
                plan.popular
                  ? "bg-gradient-to-b from-slate-950 to-indigo-950 text-white border-slate-900 md:scale-105 shadow-xl md:z-10"
                  : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800"
              )}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-white text-[9px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider select-none shadow-sm">
                  Le plus populaire
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className={cn("text-lg font-bold", plan.popular ? "text-white" : "text-slate-900 dark:text-white")}>
                    {plan.name}
                  </h3>
                  <p className={cn("text-xs mt-1", plan.popular ? "text-slate-400" : "text-slate-400 dark:text-slate-500")}>
                    {plan.description}
                  </p>
                </div>

                <div className={cn("text-3xl font-black font-mono tracking-tight", plan.popular ? "text-white" : "text-slate-900 dark:text-white")}>
                  {plan.price === 0 ? "0" : formatFCFA(plan.price).replace(" FCFA", "")}{" "}
                  <span className={cn("text-xs font-semibold", plan.popular ? "text-slate-400" : "text-slate-450 dark:text-slate-500")}>
                    FCFA/mois
                  </span>
                </div>

                {/* Features List */}
                <ul className="space-y-3 pt-2">
                  {plan.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-3 text-xs">
                      <CheckCircle
                        className={cn(
                          "h-4 w-4 shrink-0",
                          plan.popular ? "text-emerald-400" : "text-indigo-600"
                        )}
                      />
                      <span className={plan.popular ? "text-slate-300" : "text-slate-600 dark:text-slate-300"}>
                        {feat.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-6">
                {plan.popular ? (
                  <Link
                    href={plan.ctaLink}
                    className="block w-full text-center py-3 rounded-full text-xs font-bold bg-white text-slate-950 hover:bg-slate-50 hover:scale-101 transition-all outline-none shadow-md"
                  >
                    {plan.ctaText}
                  </Link>
                ) : (
                  <Link
                    href={plan.ctaLink}
                    className="flex justify-between items-center w-full px-6 py-3 border border-slate-200/80 dark:border-slate-700 hover:bg-slate-50/50 rounded-full text-xs font-bold text-slate-800 dark:text-slate-200 transition-all outline-none"
                  >
                    <span>{plan.ctaText}</span>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
