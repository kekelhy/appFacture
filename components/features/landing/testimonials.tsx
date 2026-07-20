"use client";

import { Star } from "lucide-react";

interface TestimonialItem {
  name: string;
  role: string;
  text: string;
  initials: string;
  color: string;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    name: "Amadou Diallo",
    role: "Consultant IT, Dakar",
    text: "Avant appFacture, je passais mes weekends à faire mes factures sur Excel. Maintenant, ça me prend 5 minutes et le rendu est hyper pro.",
    initials: "AD",
    color: "bg-indigo-600 text-white"
  },
  {
    name: "Yasmine Kouassi",
    role: "Agence Marketing, Abidjan",
    text: "Le calcul automatique de la TVA et le tableau de bord m'ont permis d'y voir beaucoup plus clair dans mes finances. Un outil indispensable.",
    initials: "YK",
    color: "bg-emerald-500 text-white"
  },
  {
    name: "Koffi Mensah",
    role: "Designer Freelance, Lomé",
    text: "Mes clients me prennent beaucoup plus au sérieux depuis que j'utilise appFacture. Et les relances automatiques m'ont sauvé la mise plusieurs fois.",
    initials: "KM",
    color: "bg-slate-700 text-white"
  }
];

export default function LandingTestimonials() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950/20" id="testimonials">
      <div className="container mx-auto px-6 max-w-7xl space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 reveal active">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Ils nous font confiance
          </h2>
          <p className="text-sm sm:text-base text-slate-550 dark:text-slate-400">
            Rejoignez des milliers d&apos;entrepreneurs africains qui ont simplifié leur gestion.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testi, idx) => (
            <div
              key={idx}
              className="glass-card p-6 rounded-2xl ambient-shadow hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Star rating */}
                <div className="flex text-amber-500 gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                {/* Text quote */}
                <p className="text-xs text-slate-650 dark:text-slate-350 italic leading-relaxed mb-6">
                  &quot;{testi.text}&quot;
                </p>
              </div>

              {/* User info */}
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 select-none ${testi.color}`}>
                  {testi.initials}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{testi.name}</h4>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">{testi.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
