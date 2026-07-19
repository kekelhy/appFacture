"use client";

import { useState, useEffect } from "react";
import {
  Wallet,
  ArrowRight,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Building,
  Smartphone,
  Coins,
  History,
  X
} from "lucide-react";
import { useAppStore, Transaction } from "@/lib/store";
import { formatFCFA } from "@/lib/calculations/money";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface WalletAccount {
  id: string;
  name: string;
  type: "bank" | "mobile" | "cash";
  number: string;
  initialBalance: number;
  color: string;
}

const WALLET_ACCOUNTS: WalletAccount[] = [
  {
    id: "bank",
    name: "Compte Bancaire (Ecobank)",
    type: "bank",
    number: "SN080 01001 0123456789 22",
    initialBalance: 5000000,
    color: "from-indigo-600 to-indigo-850"
  },
  {
    id: "mobile",
    name: "Wave / Orange Money",
    type: "mobile",
    number: "+221 77 123 45 67",
    initialBalance: 1500000,
    color: "from-sky-500 to-sky-700"
  },
  {
    id: "cash",
    name: "Caisse Physique",
    type: "cash",
    number: "Caisse Principale",
    initialBalance: 350000,
    color: "from-slate-700 to-slate-900"
  }
];

export default function PortfolioPage() {
  const [mounted, setMounted] = useState(false);
  const transactions = useAppStore((state) => state.transactions);
  const addTransaction = useAppStore((state) => state.addTransaction);

  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [fromAccount, setFromAccount] = useState("bank");
  const [toAccount, setToAccount] = useState("mobile");
  const [amount, setAmount] = useState("");
  const [transferDescription, setTransferDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine which account a transaction belongs to
  const getTransactionAccount = (t: Transaction): string => {
    const desc = t.description.toLowerCase();
    if (desc.includes("wave") || desc.includes("orange") || desc.includes("fiber")) {
      return "mobile";
    }
    if (desc.includes("café") || desc.includes("fournitures") || desc.includes("bureau") || desc.includes("caisse")) {
      return "cash";
    }
    return "bank";
  };

  // Calculate balances dynamically
  const accountBalances = WALLET_ACCOUNTS.map((acc) => {
    let balance = acc.initialBalance;
    transactions.forEach((t) => {
      if (getTransactionAccount(t) === acc.id) {
        if (t.type === "income") {
          balance += t.amount;
        } else {
          balance -= t.amount;
        }
      }
    });
    return {
      ...acc,
      balance
    };
  });

  const totalWealth = accountBalances.reduce((sum, acc) => sum + acc.balance, 0);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fromAccount === toAccount) {
      toast.error("Le compte source et destination doivent être différents.");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      toast.error("Veuillez saisir un montant valide.");
      return;
    }

    const sourceAcc = accountBalances.find((a) => a.id === fromAccount);
    if (sourceAcc && sourceAcc.balance < Number(amount)) {
      toast.error("Solde insuffisant sur le compte source.");
      return;
    }

    setLoading(true);
    const desc = transferDescription.trim() || `Transfert de fonds ${sourceAcc?.name}`;

    try {
      const today = new Date().toISOString().split("T")[0];
      
      // 1. Log expense in source account
      await addTransaction({
        type: "expense",
        description: `${desc} [Sortie ${fromAccount}]`,
        amount: Number(amount),
        date: today,
        category: fromAccount === "cash" ? "Bureau" : "Services"
      });

      // 2. Log income in destination account
      // Adding a marker so it matches the destination account filter logic
      let marker = "";
      if (toAccount === "mobile") marker = " (via Wave)";
      else if (toAccount === "cash") marker = " (Caisse)";
      else marker = " (Virement Bancaire)";

      await addTransaction({
        type: "income",
        description: `${desc}${marker}`,
        amount: Number(amount),
        date: today,
        category: "Autre revenu"
      });

      toast.success("Transfert de fonds enregistré !");
      setIsTransferOpen(false);
      setAmount("");
      setTransferDescription("");
    } catch (err) {
      toast.error("Erreur lors de la simulation du transfert.");
    } finally {
      setLoading(false);
    }
  };

  const getAccountIcon = (type: "bank" | "mobile" | "cash") => {
    switch (type) {
      case "bank":
        return <Building className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />;
      case "mobile":
        return <Smartphone className="h-5 w-5 text-sky-500" />;
      case "cash":
        return <Coins className="h-5 w-5 text-slate-500" />;
    }
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
            Portefeuille
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Gérez vos différents comptes bancaires et portefeuilles de Mobile Money.
          </p>
        </div>
        <button
          onClick={() => setIsTransferOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-150 hover:bg-indigo-750 transition-all duration-200"
        >
          <ArrowRight className="h-4.5 w-4.5 rotate-45" />
          Transférer des fonds
        </button>
      </div>

      {/* Global Net Worth Card */}
      <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold text-indigo-650 uppercase tracking-wider">
            Actif Liquide Total
          </p>
          <h3 className="text-2xl font-extrabold text-indigo-900 tracking-tight sm:text-3xl mt-1.5">
            {formatFCFA(totalWealth)}
          </h3>
          <p className="text-xs text-indigo-600 mt-1">
            Somme cumulée de vos comptes bancaires, Mobile Money et caisse physique.
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-indigo-100 text-indigo-600 shadow-xs">
          <Wallet className="h-6 w-6" />
        </div>
      </div>

      {/* Accounts grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {accountBalances.map((acc) => (
          <div
            key={acc.id}
            className={cn(
              "relative rounded-2xl p-6 shadow-md border border-slate-200/50 dark:border-slate-800 bg-gradient-to-br text-white overflow-hidden flex flex-col justify-between h-48",
              acc.color
            )}
          >
            {/* Background pattern */}
            <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 h-32 w-32 rounded-full bg-white/5" />

            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold opacity-75">{acc.name}</p>
                <p className="text-[10px] opacity-60 font-mono mt-0.5">{acc.number}</p>
              </div>
              <div className="bg-white/10 p-2 rounded-xl backdrop-blur-xs">
                {acc.type === "bank" && <Building className="h-4.5 w-4.5 text-white" />}
                {acc.type === "mobile" && <Smartphone className="h-4.5 w-4.5 text-white" />}
                {acc.type === "cash" && <Coins className="h-4.5 w-4.5 text-white" />}
              </div>
            </div>

            <div className="mt-8">
              <p className="text-[10px] font-bold opacity-75 uppercase tracking-wider">Solde Disponible</p>
              <h4 className="text-xl font-extrabold tracking-tight sm:text-2xl mt-1 font-mono">
                {formatFCFA(acc.balance)}
              </h4>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="rounded-xl border border-slate-200/60 bg-white shadow-xs p-6 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <History className="h-5 w-5 text-indigo-650" />
          <h3 className="text-md font-bold text-slate-800">
            Flux par compte
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {WALLET_ACCOUNTS.map((acc, index) => {
            const accTrans = transactions.filter((t) => getTransactionAccount(t) === acc.id).slice(0, 3);
            return (
              <div key={acc.id} className={cn("space-y-3", index > 0 && "pt-4 md:pt-0 md:pl-6")}>
                <div className="flex items-center gap-2">
                  {getAccountIcon(acc.type)}
                  <span className="text-xs font-bold text-slate-700">{acc.name}</span>
                </div>

                {accTrans.length === 0 ? (
                  <p className="text-[11px] text-slate-400 py-3">Aucun mouvement récent.</p>
                ) : (
                  <div className="space-y-2">
                    {accTrans.map((t) => (
                      <div key={t.id} className="flex justify-between items-center text-xs">
                        <div className="truncate max-w-[130px]" title={t.description}>
                          <p className="font-semibold text-slate-800 truncate">{t.description}</p>
                          <p className="text-[10px] text-slate-400">{t.date}</p>
                        </div>
                        <span className={cn(
                          "font-mono font-bold shrink-0",
                          t.type === "income" ? "text-emerald-650" : "text-rose-600"
                        )}>
                          {t.type === "income" ? "+" : "-"} {formatFCFA(t.amount).replace(" FCFA", "")}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Transfer Funds Modal */}
      {isTransferOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="text-base font-bold text-slate-850">
                Transférer des fonds
              </h3>
              <button
                onClick={() => setIsTransferOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleTransfer} className="p-6 space-y-4">
              {/* Source Account */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Compte Source (Débit)
                </label>
                <select
                  value={fromAccount}
                  onChange={(e) => setFromAccount(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3 text-sm text-slate-700 outline-none focus:border-indigo-650 transition-all cursor-pointer"
                >
                  {accountBalances.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({formatFCFA(a.balance).replace(" FCFA", "")})
                    </option>
                  ))}
                </select>
              </div>

              {/* Destination Account */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Compte Destination (Crédit)
                </label>
                <select
                  value={toAccount}
                  onChange={(e) => setToAccount(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3 text-sm text-slate-700 outline-none focus:border-indigo-650 transition-all cursor-pointer"
                >
                  {accountBalances.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({formatFCFA(a.balance).replace(" FCFA", "")})
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Montant à transférer (FCFA)
                </label>
                <input
                  type="number"
                  required
                  placeholder="Ex: 500000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3 text-sm text-slate-700 outline-none focus:border-indigo-650 transition-all text-right font-mono"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Motif / Référence
                </label>
                <input
                  type="text"
                  placeholder="Ex: Approvisionnement Wave"
                  value={transferDescription}
                  onChange={(e) => setTransferDescription(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3 text-sm text-slate-700 outline-none focus:border-indigo-650 transition-all"
                />
              </div>

              {/* Submit CTA */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsTransferOpen(false)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-650 hover:bg-slate-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-xs font-semibold text-white hover:bg-indigo-750 shadow-xs transition-colors"
                >
                  {loading ? "Virement..." : "Valider le transfert"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
