"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  Plus,
  Trash2,
  Calendar,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  X,
  Search,
  Filter
} from "lucide-react";
import { useAppStore, Transaction } from "@/lib/store";
import { formatFCFA } from "@/lib/calculations/money";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function TransactionsPage() {
  const [mounted, setMounted] = useState(false);
  const transactions = useAppStore((state) => state.transactions);
  const addTransaction = useAppStore((state) => state.addTransaction);
  const deleteTransaction = useAppStore((state) => state.deleteTransaction);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "income" | "expense">("all");
  
  // Slide-over State
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Form Fields
  const [type, setType] = useState<"income" | "expense">("income");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("2026-07-12");
  const [category, setCategory] = useState("Ventes");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  // Summary Metrics
  const metrics = (() => {
    let income = 0;
    let expense = 0;
    transactions.forEach((t) => {
      if (t.type === "income") income += t.amount;
      else expense += t.amount;
    });
    return {
      income,
      expense,
      net: income - expense
    };
  })();

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!description.trim()) errors.description = "La description est requise.";
    if (!amount.trim() || Number(amount) <= 0) errors.amount = "Le montant doit être supérieur à 0.";
    if (!date) errors.date = "La date est requise.";
    if (!category.trim()) errors.category = "La catégorie est requise.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await addTransaction({
        type,
        description,
        amount: Number(amount),
        date,
        category
      });
      toast.success("Transaction ajoutée avec succès !");
      setIsPanelOpen(false);
      // Reset form
      setDescription("");
      setAmount("");
      setCategory("Ventes");
    } catch (err: any) {
      toast.error("Erreur lors de la création de la transaction.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTransaction(id);
      toast.success("Transaction supprimée avec succès.");
      setConfirmDeleteId(null);
    } catch (err) {
      toast.error("Erreur lors de la suppression.");
    }
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || t.type === activeTab;
    return matchesSearch && matchesTab;
  });

  const formatDateDisplay = (dateStr: string): string => {
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  if (!mounted) {
    return (
      <div className="h-96 w-full flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-7 max-w-7xl mx-auto relative">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Transactions
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Gérez et suivez le flux des revenus et des dépenses de votre agence.
          </p>
        </div>
        <button
          onClick={() => {
            setType("income");
            setIsPanelOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-150 hover:bg-indigo-750 transition-all duration-200"
        >
          <Plus className="h-4.5 w-4.5" />
          Ajouter une transaction
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {/* Net Balance */}
        <div className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Solde Net
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className={cn(
              "text-lg font-extrabold tracking-tight sm:text-xl",
              metrics.net >= 0 ? "text-slate-800" : "text-rose-600"
            )}>
              {formatFCFA(metrics.net)}
            </h3>
            <p className="text-xs text-slate-400 mt-1">Trésorerie nette disponible</p>
          </div>
        </div>

        {/* Total Income */}
        <div className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Entrées
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <ArrowUpRight className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-extrabold text-emerald-700 tracking-tight sm:text-xl">
              {formatFCFA(metrics.income)}
            </h3>
            <p className="text-xs text-slate-400 mt-1">Volume cumulé des encaissements</p>
          </div>
        </div>

        {/* Total Expense */}
        <div className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Sorties
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <ArrowDownRight className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-extrabold text-rose-700 tracking-tight sm:text-xl">
              {formatFCFA(metrics.expense)}
            </h3>
            <p className="text-xs text-slate-400 mt-1">Volume cumulé des décaissements</p>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="rounded-xl border border-slate-200/60 bg-white shadow-xs overflow-hidden">
        {/* Table Filters Header */}
        <div className="border-b border-slate-100 p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-slate-50/20">
          <div className="flex p-1 rounded-xl bg-slate-100 gap-0.5 border border-slate-200/50 max-w-xs">
            <button
              onClick={() => setActiveTab("all")}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all",
                activeTab === "all" ? "bg-white shadow-xs text-indigo-650" : "text-slate-500 hover:text-slate-700"
              )}
            >
              Tous
            </button>
            <button
              onClick={() => setActiveTab("income")}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all",
                activeTab === "income" ? "bg-white shadow-xs text-emerald-600" : "text-slate-500 hover:text-slate-700"
              )}
            >
              Entrées
            </button>
            <button
              onClick={() => setActiveTab("expense")}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all",
                activeTab === "expense" ? "bg-white shadow-xs text-rose-600" : "text-slate-500 hover:text-slate-700"
              )}
            >
              Sorties
            </button>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher par description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-600 transition-colors shadow-xs"
            />
          </div>
        </div>

        {/* DataTable */}
        <div className="overflow-x-auto">
          {filteredTransactions.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              Aucune transaction trouvée.
            </div>
          ) : (
            <table className="w-full text-left table-auto">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold text-[10px] bg-slate-50/30">
                  <th className="py-3 px-5">Description</th>
                  <th className="py-3 px-5">Date</th>
                  <th className="py-3 px-5">Catégorie</th>
                  <th className="py-3 px-5 text-right">Montant (FCFA)</th>
                  <th className="py-3 px-5 text-center w-20">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-650">
                {filteredTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-5 font-bold text-slate-800">{t.description}</td>
                    <td className="py-4 px-5 text-xs text-slate-500">{formatDateDisplay(t.date)}</td>
                    <td className="py-4 px-5">
                      <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs text-slate-600 font-semibold">
                        {t.category}
                      </span>
                    </td>
                    <td className={cn(
                      "py-4 px-5 text-right font-mono font-bold",
                      t.type === "income" ? "text-emerald-650" : "text-rose-600"
                    )}>
                      {t.type === "income" ? "+" : "-"} {formatFCFA(t.amount).replace(" FCFA", "")}
                    </td>
                    <td className="py-4 px-5 text-center">
                      <button
                        onClick={() => setConfirmDeleteId(t.id)}
                        className="rounded-lg p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                        title="Supprimer la transaction"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <h4 className="text-base font-bold text-slate-900">Supprimer la transaction</h4>
            <p className="text-xs text-slate-500 mt-2">
              Êtes-vous sûr de vouloir supprimer définitivement cette transaction ? Cette action est irréversible.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-rose-700 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Transaction Slide-Over */}
      {isPanelOpen && (
        <>
          <div
            onClick={() => setIsPanelOpen(false)}
            className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm transition-opacity"
          />
          <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white p-6 shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <h3 className="text-base font-bold text-slate-800">
                Ajouter une transaction
              </h3>
              <button
                onClick={() => setIsPanelOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between">
              <div className="space-y-5">
                {/* Type Selection */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Type de transaction
                  </label>
                  <div className="flex p-1 rounded-xl bg-slate-100 gap-0.5 border border-slate-200/50">
                    <button
                      type="button"
                      onClick={() => {
                        setType("income");
                        setCategory("Ventes");
                      }}
                      className={cn(
                        "flex-1 py-2 text-xs font-semibold rounded-lg transition-all",
                        type === "income"
                          ? "bg-white shadow-xs text-emerald-600"
                          : "text-slate-500 hover:text-slate-700"
                      )}
                    >
                      Revenu / Entrée
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setType("expense");
                        setCategory("Infrastructure");
                      }}
                      className={cn(
                        "flex-1 py-2 text-xs font-semibold rounded-lg transition-all",
                        type === "expense"
                          ? "bg-white shadow-xs text-rose-600"
                          : "text-slate-500 hover:text-slate-700"
                      )}
                    >
                      Dépense / Sortie
                    </button>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Description
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Facture d'infrastructure cloud AWS"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={cn(
                      "w-full rounded-xl border bg-slate-50/50 py-2.5 px-3 text-sm text-slate-700 focus:border-indigo-600 focus:bg-white outline-none transition-all",
                      formErrors.description ? "border-rose-350" : "border-slate-200"
                    )}
                  />
                  {formErrors.description && (
                    <p className="text-[10px] text-rose-600">{formErrors.description}</p>
                  )}
                </div>

                {/* Amount */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Montant (FCFA)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="Montant en Franc CFA"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className={cn(
                      "w-full rounded-xl border bg-slate-50/50 py-2.5 px-3 text-sm text-slate-700 focus:border-indigo-600 focus:bg-white outline-none transition-all text-right font-mono",
                      formErrors.amount ? "border-rose-350" : "border-slate-200"
                    )}
                  />
                  {formErrors.amount && (
                    <p className="text-[10px] text-rose-600">{formErrors.amount}</p>
                  )}
                </div>

                {/* Date */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={cn(
                      "w-full rounded-xl border bg-slate-50/50 py-2.5 px-3 text-sm text-slate-700 focus:border-indigo-600 focus:bg-white outline-none transition-all",
                      formErrors.date ? "border-rose-350" : "border-slate-200"
                    )}
                  />
                </div>

                {/* Category Selection */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Catégorie
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3 text-sm text-slate-700 focus:border-indigo-600 focus:bg-white outline-none transition-all cursor-pointer"
                  >
                    {type === "income" ? (
                      <>
                        <option value="Ventes">Ventes / Prestations</option>
                        <option value="Subventions">Subventions</option>
                        <option value="Investissements">Investissements</option>
                        <option value="Autre revenu">Autre Revenu</option>
                      </>
                    ) : (
                      <>
                        <option value="Infrastructure">Infrastructure Cloud</option>
                        <option value="Services">Services & Abonnements</option>
                        <option value="Sous-traitance">Sous-traitance & Prestataires</option>
                        <option value="Bureau">Frais de bureau & Internet</option>
                        <option value="Marketing">Marketing & Communication</option>
                        <option value="Autre dépense">Autre Dépense</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="border-t border-slate-100 pt-4 flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsPanelOpen(false)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-705 shadow-xs transition-colors"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
