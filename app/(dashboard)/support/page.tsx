"use client";

import { useState } from "react";
import {
  HelpCircle,
  MessageSquare,
  ChevronDown,
  Send
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    id: 1,
    question: "Comment fonctionne le calcul de la TVA à 18% sur proFacture ?",
    answer: "Conformément aux règles de l'UEMOA pour les entrepreneurs, la TVA de 18% est calculée globalement sur le sous-total brut cumulé de vos prestations. Chaque ligne d'article est calculée et arrondie individuellement à l'entier le plus proche (le FCFA n'ayant pas de centimes), puis la TVA de 18% est appliquée une seule fois sur le sous-total arrondi pour éviter tout écart de centime."
  },
  {
    id: 2,
    question: "Comment modifier le préfixe de numérotation de mes factures ?",
    answer: "Vous pouvez modifier le format de numérotation automatique de vos factures dans la page 'Paramètres' de l'application. En changeant le préfixe par défaut (ex: 'FAC-2026-'), toutes vos futures factures adopteront ce nouveau format de manière séquentielle."
  },
  {
    id: 3,
    question: "Comment enregistrer un règlement ou changer le statut d'une facture ?",
    answer: "Le suivi des paiements s'effectue manuellement dans proFacture. Dans la liste des factures, cliquez sur les trois points (...) d'une facture et choisissez 'Marquer payée'. Vous pouvez également ouvrir le détail d'une facture et utiliser le dropdown de statut rapide pour passer de Brouillon à Envoyée ou Payée. Les indicateurs financiers de votre Dashboard se synchroniseront instantanément."
  },
  {
    id: 4,
    question: "Puis-je exporter mes factures en PDF ou les envoyer par email ?",
    answer: "Dans cette version prototype client (Phase 1-2), les boutons de téléchargement PDF et d'envoi par email affichent des notifications de simulation. Ces fonctionnalités seront entièrement branchées dans la Phase 3 (Supabase) et Phase 4 (intégration avec les API d'envoi d'emails Resend et de génération PDF)."
  }
];

export default function SupportPage() {
  const [activeFaqId, setActiveFaqId] = useState<number | null>(null);

  // Form state
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleFaq = (id: number) => {
    setActiveFaqId(prev => (prev === id ? null : id));
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      toast.error("Veuillez remplir tous les champs du formulaire.");
      return;
    }

    setIsSubmitting(true);
    // Simulate API delay
    setTimeout(() => {
      setIsSubmitting(false);
      setSubject("");
      setMessage("");
      toast.success("Votre demande d'assistance a été transmise ! Notre équipe vous répondra sous 24h.");
    }, 1200);
  };

  return (
    <div className="space-y-7 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          Aide & Support
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Consultez la foire aux questions ou contactez directement notre équipe d&apos;assistance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: FAQs Accordion */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-slate-200/60 bg-white p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
              <HelpCircle className="h-4.5 w-4.5 text-indigo-500" />
              Foire Aux Questions
            </h3>

            <div className="divide-y divide-slate-100">
              {FAQS.map((faq) => {
                const isOpen = activeFaqId === faq.id;
                return (
                  <div key={faq.id} className="py-3.5">
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full flex items-center justify-between text-left font-semibold text-slate-700 hover:text-indigo-600 transition-colors py-1 text-sm outline-none"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 text-slate-400 transition-transform duration-250",
                          isOpen ? "transform rotate-180 text-indigo-600" : ""
                        )}
                      />
                    </button>
                    {isOpen && (
                      <div className="mt-2.5 text-xs text-slate-500 leading-relaxed pl-1 animate-fade-in">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Contact form */}
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200/60 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <MessageSquare className="h-4.5 w-4.5 text-indigo-500" />
              Nous écrire
            </h3>

            <form onSubmit={handleContactSubmit} className="space-y-4">
              {/* Subject */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-450 uppercase tracking-wider">
                  Sujet du message
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Problème d'arrondi de taxe..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-sm text-slate-750 focus:border-indigo-600 focus:bg-white outline-none transition-all"
                />
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-455 uppercase tracking-wider">
                  Message / Description
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Décrivez votre demande en détail..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-sm text-slate-750 focus:border-indigo-600 focus:bg-white outline-none transition-all resize-none"
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-150 hover:bg-indigo-750 transition-all",
                  isSubmitting ? "opacity-60 cursor-not-allowed" : ""
                )}
              >
                <Send className="h-4 w-4" />
                {isSubmitting ? "Envoi..." : "Envoyer la demande"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
