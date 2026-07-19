"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  FileText,
  User,
  PieChart
} from "lucide-react";
import { useAppStore, Invoice } from "@/lib/store";
import { formatFCFA } from "@/lib/calculations/money";

export default function ReportsPage() {
  const [mounted, setMounted] = useState(false);
  const invoices = useAppStore((state) => state.invoices);
  const clients = useAppStore((state) => state.clients);

  useEffect(() => {
    setMounted(true);
  }, []);

  const TODAY_STR = "2026-07-12";

  // derived overdue status
  const getInvoiceStatus = (inv: Invoice): "draft" | "sent" | "paid" | "overdue" => {
    if (inv.status === "sent" && inv.dueDate < TODAY_STR) {
      return "overdue";
    }
    return inv.status;
  };

  // Calculations
  const stats = (() => {
    let totalInvoiced = 0;
    let totalPaid = 0;
    let totalUnpaid = 0; // pending + overdue
    let countPaid = 0;
    let countUnpaid = 0;
    let countDraft = 0;

    invoices.forEach((inv) => {
      const status = getInvoiceStatus(inv);
      if (status !== "draft") {
        totalInvoiced += inv.total;
        if (status === "paid") {
          totalPaid += inv.total;
          countPaid++;
        } else {
          totalUnpaid += inv.total;
          countUnpaid++;
        }
      } else {
        countDraft++;
      }
    });

    const recoveryRate = totalInvoiced > 0 ? Math.round((totalPaid / totalInvoiced) * 100) : 0;

    return {
      invoiced: totalInvoiced,
      paid: totalPaid,
      unpaid: totalUnpaid,
      countPaid,
      countUnpaid,
      countDraft,
      recoveryRate
    };
  })();

  // Calculer le chiffre d'affaires par client
  const clientRevenue = clients.map((c) => {
    let invoicedAmount = 0;
    let paidAmount = 0;
    let count = 0;

    invoices.forEach((inv) => {
      if (inv.clientId === c.id) {
        const status = getInvoiceStatus(inv);
        if (status !== "draft") {
          invoicedAmount += inv.total;
          count++;
          if (status === "paid") {
            paidAmount += inv.total;
          }
        }
      }
    });

    return {
      ...c,
      invoicedAmount,
      paidAmount,
      invoiceCount: count
    };
  }).sort((a, b) => b.invoicedAmount - a.invoicedAmount); // Trier par montant facturé décroissant

  if (!mounted) {
    return (
      <div className="h-96 w-full flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-7 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          Rapports & Vues de Synthèse
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Analysez vos performances financières, vos délais de règlement et votre encours par client.
        </p>
      </div>

      {/* Grid 4 cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Invoiced */}
        <div className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Facturé</span>
          <div className="mt-3 flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">{formatFCFA(stats.invoiced)}</h3>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <TrendingUp className="h-4.5 w-4.5" />
            </div>
          </div>
        </div>

        {/* Total Encaissé */}
        <div className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Encaissé</span>
          <div className="mt-3 flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">{formatFCFA(stats.paid)}</h3>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle className="h-4.5 w-4.5" />
            </div>
          </div>
        </div>

        {/* Encours Client */}
        <div className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Encours (Non Payé)</span>
          <div className="mt-3 flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">{formatFCFA(stats.unpaid)}</h3>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
              <TrendingDown className="h-4.5 w-4.5" />
            </div>
          </div>
        </div>

        {/* Taux de recouvrement */}
        <div className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Recouvrement</span>
          <div className="mt-3 flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">{stats.recoveryRate}%</h3>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
              <PieChart className="h-4.5 w-4.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Client breakdown table */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200/60 bg-white p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="h-4.5 w-4.5 text-indigo-500" />
            Ventes par client
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-2 w-48">Client</th>
                  <th className="pb-2 text-center w-24">Factures</th>
                  <th className="pb-2 text-right w-36">Montant Facturé</th>
                  <th className="pb-2 text-right w-36">Montant Encaissé</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-medium text-slate-600">
                {clientRevenue.map((cr) => (
                  <tr key={cr.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 font-bold text-slate-800">{cr.name}</td>
                    <td className="py-2.5 text-center font-semibold text-slate-500">{cr.invoiceCount}</td>
                    <td className="py-2.5 text-right font-mono font-bold text-slate-750">{formatFCFA(cr.invoicedAmount)}</td>
                    <td className="py-2.5 text-right font-mono font-bold text-emerald-650">{formatFCFA(cr.paidAmount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Status summary counts */}
        <div className="rounded-xl border border-slate-200/60 bg-white p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <BarChart3 className="h-4.5 w-4.5 text-indigo-500" />
            Répartition des factures
          </h3>

          <div className="space-y-4 pt-2">
            {/* Payée bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Règlées ({stats.countPaid})
                </span>
                <span>{formatFCFA(stats.paid)}</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{
                    width: `${stats.invoiced > 0 ? (stats.paid / stats.invoiced) * 100 : 0}%`
                  }}
                />
              </div>
            </div>

            {/* En attente bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  En attente / Retard ({stats.countUnpaid})
                </span>
                <span>{formatFCFA(stats.unpaid)}</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-sky-500 h-full rounded-full"
                  style={{
                    width: `${stats.invoiced > 0 ? (stats.unpaid / stats.invoiced) * 100 : 0}%`
                  }}
                />
              </div>
            </div>

            <div className="h-px bg-slate-100 my-4" />

            {/* Draft info block */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <div className="font-bold text-slate-700">Factures brouillons</div>
                <div className="text-[10px] text-slate-400">Non comptabilisées dans le C.A.</div>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200/50">
                <FileText className="h-3.5 w-3.5" />
                {stats.countDraft}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
