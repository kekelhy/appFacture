"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";
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
    ctaText: "Commencer gratuitement",
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
    ctaText: "Choisir l'offre Pro",
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
    ctaText: "Choisir l'offre Business",
    ctaLink: "/dashboard",
    features: [
      { text: "Tout de l'offre Pro" },
      { text: "Accès multi-utilisateurs (3)" },
      { text: "Export comptable avancé" },
      { text: "Support prioritaire 24/7" }
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
          <p className="text-sm sm:text-base text-slate-550 dark:text-slate-400">
            Choisissez le plan qui correspond à la taille de votre activité.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
          {PRICING_PLANS.map((plan, idx) => (
            <div
              key={idx}
              className={cn(
                "rounded-3xl p-6 shadow-md border flex flex-col justify-between h-[380px] transition-all duration-350 relative",
                plan.popular
                  ? "bg-indigo-600 text-white border-indigo-750 md:scale-105 shadow-xl md:z-10"
                  : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800"
              )}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[9px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-3xl uppercase tracking-wider select-none">
                  Populaire
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className={cn("text-base font-extrabold", plan.popular ? "text-white" : "text-slate-900 dark:text-white")}>
                    {plan.name}
                  </h3>
                  <p className={cn("text-[10px] mt-0.5", plan.popular ? "text-indigo-200" : "text-slate-450 dark:text-slate-500")}>
                    {plan.description}
                  </p>
                </div>

                <div className={cn("text-2xl font-black font-mono", plan.popular ? "text-white" : "text-slate-900 dark:text-white")}>
                  {plan.price === 0 ? "0" : formatFCFA(plan.price).replace(" FCFA", "")}{" "}
                  <span className={cn("text-xs font-medium", plan.popular ? "text-indigo-200" : "text-slate-450 dark:text-slate-500")}>
                    FCFA / {plan.period}
                  </span>
                </div>

                {/* Features List */}
                <ul className="space-y-2.5 pt-2">
                  {plan.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2 text-xs">
                      <CheckCircle
                        className={cn(
                          "h-4 w-4 shrink-0",
                          plan.popular ? "text-emerald-350" : "text-emerald-500"
                        )}
                      />
                      <span className={plan.popular ? "text-indigo-100" : "text-slate-650 dark:text-slate-300"}>
                        {feat.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <Link
                  href={plan.ctaLink}
                  className={cn(
                    "block w-full text-center py-2.5 rounded-xl text-xs font-bold transition-colors outline-none",
                    plan.popular
                      ? "bg-white text-indigo-650 hover:bg-slate-50 shadow-md"
                      : "border border-indigo-600 text-indigo-600 hover:bg-indigo-50/40"
                  )}
                >
                  {plan.ctaText}
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
