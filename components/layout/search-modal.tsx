"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, FileText, Users, ArrowRight, TrendingUp } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { formatFCFA } from "@/lib/calculations/money";
import { cn } from "@/lib/utils";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const invoices = useAppStore((state) => state.invoices);
  const clients = useAppStore((state) => state.clients);
  const transactions = useAppStore((state) => state.transactions);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery("");
    }
  }, [isOpen]);

  // Handle global shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Perform search matching
  const matchingInvoices = query.trim()
    ? invoices.filter(
        (inv) =>
          inv.invoiceNumber.toLowerCase().includes(query.toLowerCase()) ||
          clients.find((c) => c.id === inv.clientId)?.name.toLowerCase().includes(query.toLowerCase()) ||
          inv.status.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const matchingClients = query.trim()
    ? clients.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.email.toLowerCase().includes(query.toLowerCase()) ||
          c.phone.includes(query)
      )
    : [];

  const matchingTransactions = query.trim()
    ? transactions.filter(
        (t) =>
          t.description.toLowerCase().includes(query.toLowerCase()) ||
          t.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const hasResults =
    matchingInvoices.length > 0 || matchingClients.length > 0 || matchingTransactions.length > 0;

  const handleNavigate = (path: string) => {
    router.push(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/60 backdrop-blur-sm p-4 pt-20">
      {/* Click outside to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Search container */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[500px] animate-in fade-in slide-in-from-top-4 duration-200">
        
        {/* Search Input Header */}
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 px-4 py-3.5">
          <Search className="h-5 w-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Rechercher des factures, clients, transactions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none text-sm text-slate-850 dark:text-slate-100 placeholder-slate-400 outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Effacer
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-2 py-1 text-[10px] font-bold text-slate-500 font-mono shadow-xs select-none"
          >
            ESC
          </button>
        </div>

        {/* Search Results Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!query.trim() ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              <Search className="h-8 w-8 text-slate-200 mx-auto mb-2" />
              Saisissez un mot-clé pour lancer la recherche globale
            </div>
          ) : !hasResults ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              Aucun résultat trouvé pour &quot;<span className="font-semibold text-slate-600 dark:text-slate-350">{query}</span>&quot;
            </div>
          ) : (
            <div className="space-y-4">
              {/* Invoices Group */}
              {matchingInvoices.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2">
                    Factures ({matchingInvoices.length})
                  </h4>
                  <div className="space-y-1">
                    {matchingInvoices.map((inv) => {
                      const clientName = clients.find((c) => c.id === inv.clientId)?.name || "Client inconnu";
                      return (
                        <button
                          key={inv.id}
                          onClick={() => handleNavigate(`/invoices/${inv.id}`)}
                          className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-950/40 border border-transparent hover:border-slate-100 dark:hover:border-slate-800/50 transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                              <FileText className="h-4.5 w-4.5" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-850 dark:text-slate-200">{inv.invoiceNumber}</p>
                              <p className="text-[10px] text-slate-450 dark:text-slate-500">Client : {clientName}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-300">
                              {formatFCFA(inv.total)}
                            </span>
                            <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Clients Group */}
              {matchingClients.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2">
                    Clients ({matchingClients.length})
                  </h4>
                  <div className="space-y-1">
                    {matchingClients.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => handleNavigate(`/clients`)}
                        className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-950/40 border border-transparent hover:border-slate-100 dark:hover:border-slate-800/50 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                            <Users className="h-4.5 w-4.5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-850 dark:text-slate-200">{c.name}</p>
                            <p className="text-[10px] text-slate-455 dark:text-slate-500">{c.email} | {c.phone}</p>
                          </div>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-emerald-650 dark:group-hover:text-emerald-400 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Transactions Group */}
              {matchingTransactions.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2">
                    Transactions ({matchingTransactions.length})
                  </h4>
                  <div className="space-y-1">
                    {matchingTransactions.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => handleNavigate(`/transactions`)}
                        className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-950/40 border border-transparent hover:border-slate-100 dark:hover:border-slate-800/50 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
                              t.type === "income"
                                ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400"
                                : "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-455"
                            )}
                          >
                            <TrendingUp className="h-4.5 w-4.5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-850 dark:text-slate-200">{t.description}</p>
                            <p className="text-[10px] text-slate-450 dark:text-slate-500">Catégorie : {t.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "text-xs font-mono font-bold",
                              t.type === "income" ? "text-emerald-650" : "text-rose-600"
                            )}
                          >
                            {t.type === "income" ? "+" : "-"} {formatFCFA(t.amount)}
                          </span>
                          <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
