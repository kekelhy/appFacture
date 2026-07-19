"use client";

import { useState, useEffect } from "react";
import {
  PieChart,
  Edit3,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  X,
  Plus,
  ArrowRight,
  Info
} from "lucide-react";
import { useAppStore, Budget, Transaction } from "@/lib/store";
import { formatFCFA } from "@/lib/calculations/money";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface CategoryMeta {
  name: string;
  defaultLimit: number;
  description: string;
}

const CATEGORY_METAS: Record<string, CategoryMeta> = {
  "Infrastructure": {
    name: "Infrastructure Cloud",
    defaultLimit: 150000,
    description: "Hébergement AWS, Vercel, Supabase et bases de données."
  },
  "Services": {
    name: "Services & Abonnements",
    defaultLimit: 50000,
    description: "Abonnement internet, outils SaaS (Slack, Notion, Figma)."
  },
  "Sous-traitance": {
    name: "Sous-traitance & Freelances",
    defaultLimit: 500000,
    description: "Prestataires de services externes, design et développement."
  },
  "Bureau": {
    name: "Frais de bureau",
    defaultLimit: 30000,
    description: "Fournitures de bureau, café et consommables."
  },
  "Marketing": {
    name: "Marketing & Publicité",
    defaultLimit: 100000,
    description: "Campagnes publicitaires Meta, Google Ads et flyers."
  }
};

export default function BudgetPage() {
  const [mounted, setMounted] = useState(false);
  const budgets = useAppStore((state) => state.budgets);
  const transactions = useAppStore((state) => state.transactions);
  const updateBudget = useAppStore((state) => state.updateBudget);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Infrastructure");
  const [limitAmount, setLimitAmount] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Compute stats for all categories
  const categoryBudgets = Object.keys(CATEGORY_METAS).map((catKey) => {
    const meta = CATEGORY_METAS[catKey];
    
    // Find custom limit or fallback to default
    const customBudget = budgets.find((b) => b.category === catKey);
    const limit = customBudget ? customBudget.limitAmount : meta.defaultLimit;

    // Calculate total spent for this category
    const spent = transactions
      .filter((t) => t.type === "expense" && t.category === catKey)
      .reduce((sum, t) => sum + t.amount, 0);

    const remaining = limit - spent;
    const progressPercent = Math.min((spent / limit) * 100, 100);

    return {
      key: catKey,
      name: meta.name,
      description: meta.description,
      limit,
      spent,
      remaining,
      progressPercent
    };
  });

  const handleSaveBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!limitAmount || Number(limitAmount) <= 0) {
      toast.error("Veuillez saisir une limite budgétaire valide.");
      return;
    }

    setLoading(true);
    try {
      await updateBudget(selectedCategory, Number(limitAmount));
      toast.success(`Budget de la catégorie ${CATEGORY_METAS[selectedCategory].name} mis à jour !`);
      setIsModalOpen(false);
      setLimitAmount("");
    } catch (err) {
      toast.error("Erreur lors de la mise à jour du budget.");
    } finally {
      setLoading(false);
    }
  };

  const getProgressBarColor = (percent: number) => {
    if (percent >= 100) return "bg-rose-500";
    if (percent >= 80) return "bg-amber-500";
    return "bg-indigo-600";
  };

  if (!mounted) {
    return (
      <div className="h-96 w-full flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-7 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Budgets Dépenses
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Fixez des plafonds de dépenses mensuelles et suivez l&apos;évolution de vos coûts en temps réel.
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedCategory("Infrastructure");
            setIsModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-150 hover:bg-indigo-750 transition-all duration-200"
        >
          <Plus className="h-4.5 w-4.5" />
          Ajuster un budget
        </button>
      </div>

      {/* Info Banner */}
      <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 flex gap-3 text-xs text-blue-800 leading-normal">
        <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Astuce de gestion :</span> Les barres de progression calculent en temps réel la somme de vos dépenses enregistrées dans la page <span className="font-semibold underline">Transactions</span> pour chaque catégorie. Les alertes de couleur passent à l&apos;orange à 80% du budget consommé, et au rouge clignotant en cas de dépassement.
        </div>
      </div>

      {/* Budgets Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categoryBudgets.map((budget) => {
          const isOver = budget.spent > budget.limit;
          const isWarning = budget.progressPercent >= 80 && budget.progressPercent < 100;
          
          return (
            <div
              key={budget.key}
              className={cn(
                "rounded-2xl border bg-white p-5 shadow-xs flex flex-col justify-between h-64 transition-all duration-300 hover:shadow-md",
                isOver ? "border-rose-250 bg-rose-50/5" : "border-slate-200/60"
              )}
            >
              <div>
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-bold text-slate-800 tracking-tight leading-snug">
                    {budget.name}
                  </h4>
                  <button
                    onClick={() => {
                      setSelectedCategory(budget.key);
                      setLimitAmount(budget.limit.toString());
                      setIsModalOpen(true);
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-colors"
                    title="Ajuster le plafond"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-[11px] text-slate-450 mt-1.5 leading-normal line-clamp-2">
                  {budget.description}
                </p>
              </div>

              {/* Progress and status */}
              <div className="space-y-3.5 mt-4">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Consommé</span>
                    <span className="text-sm font-extrabold text-slate-800 font-mono">
                      {formatFCFA(budget.spent).replace(" FCFA", "")} / {formatFCFA(budget.limit).replace(" FCFA", "")}
                    </span>
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                    isOver
                      ? "bg-rose-50 text-rose-600 border border-rose-200/30 animate-pulse"
                      : isWarning
                      ? "bg-amber-50 text-amber-600 border border-amber-200/30"
                      : "bg-emerald-50 text-emerald-600 border border-emerald-200/30"
                  )}>
                    {isOver ? "Dépassé" : `${Math.round(budget.progressPercent)}%`}
                  </span>
                </div>

                {/* Progress bar container */}
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all duration-500", getProgressBarColor(budget.progressPercent))}
                    style={{ width: `${budget.progressPercent}%` }}
                  />
                </div>

                {/* Remaining budget footer */}
                <div className="flex justify-between items-center pt-2 border-t border-slate-50 text-[11px]">
                  <span className="text-slate-450">Reste :</span>
                  <span className={cn(
                    "font-bold font-mono",
                    budget.remaining >= 0 ? "text-slate-700" : "text-rose-600"
                  )}>
                    {budget.remaining >= 0 ? formatFCFA(budget.remaining) : `-${formatFCFA(Math.abs(budget.remaining))}`}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Adjust Budget Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="text-base font-bold text-slate-850">
                Ajuster le budget
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveBudget} className="p-6 space-y-4">
              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Catégorie de dépense
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3 text-sm text-slate-700 outline-none focus:border-indigo-650 transition-all cursor-pointer"
                >
                  {Object.keys(CATEGORY_METAS).map((key) => (
                    <option key={key} value={key}>
                      {CATEGORY_METAS[key].name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Limit */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Limite Mensuelle (FCFA)
                </label>
                <input
                  type="number"
                  required
                  placeholder="Ex: 200000"
                  value={limitAmount}
                  onChange={(e) => setLimitAmount(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3 text-sm text-slate-700 outline-none focus:border-indigo-650 transition-all text-right font-mono"
                />
              </div>

              {/* Submit CTA */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-650 hover:bg-slate-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-xs font-semibold text-white hover:bg-indigo-750 shadow-xs transition-colors"
                >
                  {loading ? "Mise à jour..." : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
