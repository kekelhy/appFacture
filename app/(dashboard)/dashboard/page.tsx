"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  ArrowUpRight,
  MoreHorizontal,
  Eye,
  Edit,
  Check,
  Calendar
} from "lucide-react";
import { useAppStore, Invoice } from "@/lib/store";
import { formatFCFA } from "@/lib/calculations/money";
import { cn } from "@/lib/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

// Composant Badge de Statut Localisé
function StatusBadge({ status }: { status: "draft" | "sent" | "paid" | "overdue" }) {
  const configs = {
    paid: {
      bg: "bg-emerald-55/70 text-emerald-700 border-emerald-200/50",
      dot: "bg-emerald-500",
      label: "Payée"
    },
    sent: {
      bg: "bg-sky-50 text-sky-700 border-sky-200/50",
      dot: "bg-sky-500",
      label: "Envoyée"
    },
    draft: {
      bg: "bg-slate-50 text-slate-600 border-slate-200/50",
      dot: "bg-slate-400",
      label: "Brouillon"
    },
    overdue: {
      bg: "bg-rose-50 text-rose-700 border-rose-200/50",
      dot: "bg-rose-500",
      label: "En retard"
    }
  };

  const config = configs[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border",
        config.bg
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full animate-pulse", config.dot)} />
      {config.label}
    </span>
  );
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    payload: {
      month: string;
      facturé: number;
      payé: number;
    };
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg text-xs space-y-1.5">
        <p className="font-bold text-slate-800 border-b border-slate-100 pb-1">{payload[0].payload.month}</p>
        <div className="space-y-0.5">
          <p className="text-indigo-600 font-semibold">
            Facturé : {formatFCFA(payload[0].value)}
          </p>
          {payload[1] && (
            <p className="text-emerald-650 font-semibold">
              Encaissé : {formatFCFA(payload[1].value)}
            </p>
          )}
        </div>
      </div>
    );
  }
  return null;
}

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const invoices = useAppStore((state) => state.invoices);
  const clients = useAppStore((state) => state.clients);
  const updateInvoiceStatus = useAppStore((state) => state.updateInvoiceStatus);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Déterminer la date courante pour la dérive "en retard"
  const TODAY_STR = "2026-07-12";

  // Calcul dynamique des statuts dérivés (notamment en retard)
  const getInvoiceStatus = (invoice: Invoice): "draft" | "sent" | "paid" | "overdue" => {
    if (invoice.status === "sent" && invoice.dueDate < TODAY_STR) {
      return "overdue";
    }
    return invoice.status;
  };

  // Calculer les statistiques
  const stats = (() => {
    let totalInvoiced = 0; // paid + sent (including overdue)
    let totalPaid = 0;
    let totalPending = 0; // sent (not overdue)
    let totalOverdue = 0; // sent (overdue)

    invoices.forEach((inv) => {
      const status = getInvoiceStatus(inv);
      if (status !== "draft") {
        totalInvoiced += inv.total;
      }
      if (status === "paid") {
        totalPaid += inv.total;
      } else if (status === "sent") {
        totalPending += inv.total;
      } else if (status === "overdue") {
        totalOverdue += inv.total;
      }
    });

    return {
      invoiced: totalInvoiced,
      paid: totalPaid,
      pending: totalPending,
      overdue: totalOverdue
    };
  })();

  // Dynamically compute cash flow data for the last 6 months
  const chartData = (() => {
    const monthNames = [
      "Jan", "Fév", "Mar", "Avr", "Mai", "Juin", 
      "Juil", "Août", "Sept", "Oct", "Nov", "Déc"
    ];
    
    const last6Months: { month: string; yearNum: number; monthNum: number; facturé: number; payé: number }[] = [];
    const referenceDate = new Date(2026, 6, 12); // Base date: Sunday, July 12, 2026
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - i, 1);
      last6Months.push({
        month: `${monthNames[d.getMonth()]} ${d.getFullYear().toString().substring(2)}`,
        yearNum: d.getFullYear(),
        monthNum: d.getMonth(),
        facturé: 0,
        payé: 0
      });
    }

    invoices.forEach((inv) => {
      if (inv.status === "draft") return; // ignore drafts
      const [year, month] = inv.issueDate.split("-").map(Number);
      if (!year || !month) return;
      
      const invMonthIndex = month - 1; // 0-indexed
      
      // Find matching slot in last 6 months
      const slot = last6Months.find(
        (m) => m.yearNum === year && m.monthNum === invMonthIndex
      );
      
      if (slot) {
        slot.facturé += inv.total;
        if (inv.status === "paid") {
          slot.payé += inv.total;
        }
      }
    });

    return last6Months.map(({ month, facturé, payé }) => ({
      month,
      "facturé": facturé,
      "payé": payé
    }));
  })();

  // Formater une date de YYYY-MM-DD en DD/MM/YYYY
  const formatDateDisplay = (dateStr: string): string => {
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  // Action locale : Marquer comme payée
  const handleMarkAsPaid = (id: string) => {
    updateInvoiceStatus(id, "paid");
    setActiveMenuId(null);
  };

  return (
    <div className="space-y-7 max-w-7xl mx-auto">
      {/* Header section avec actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Bonjour, Kekeli 👋
          </h2>
          <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            Nous sommes le dimanche 12 juillet 2026
          </p>
        </div>
        <Link
          href="/invoices/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-150 hover:bg-indigo-750 transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
          Créer une facture
        </Link>
      </div>

      {/* Grid 4 Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Chiffre d'affaires facturé */}
        <div className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-xs hover:shadow-md hover:border-slate-300/40 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Facturé
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-extrabold text-slate-800 tracking-tight sm:text-xl">
              {formatFCFA(stats.invoiced)}
            </h3>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span className="font-semibold text-emerald-600">+12.5%</span> ce mois-ci
            </p>
          </div>
        </div>

        {/* Card 2: Montant Encaissé (Paid) */}
        <div className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-xs hover:shadow-md hover:border-slate-300/40 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Montant Encaissé
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-650">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-extrabold text-slate-800 tracking-tight sm:text-xl">
              {formatFCFA(stats.paid)}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Taux de recouvrement :{" "}
              <span className="font-semibold text-indigo-600">
                {stats.invoiced > 0 ? Math.round((stats.paid / stats.invoiced) * 100) : 0}%
              </span>
            </p>
          </div>
        </div>

        {/* Card 3: En attente (Sent) */}
        <div className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-xs hover:shadow-md hover:border-slate-300/40 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              En Attente
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-extrabold text-slate-800 tracking-tight sm:text-xl">
              {formatFCFA(stats.pending)}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Factures envoyées non échues
            </p>
          </div>
        </div>

        {/* Card 4: En retard (Overdue) */}
        <div className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-xs hover:shadow-md hover:border-slate-300/40 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              En Retard
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <AlertCircle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-extrabold text-rose-700 tracking-tight sm:text-xl">
              {formatFCFA(stats.overdue)}
            </h3>
            <p className="text-xs text-rose-500 mt-1 font-medium">
              Action requise immédiatement
            </p>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="rounded-xl border border-slate-200/60 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h3 className="text-md font-bold text-slate-800 sm:text-lg">
              Évolution des flux de trésorerie
            </h3>
            <p className="text-xs text-slate-400">
              Comparatif mensuel des volumes facturés vs volumes encaissés
            </p>
          </div>
          {/* Légende rapide */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-md bg-indigo-600" />
              <span className="font-medium text-slate-600">Facturé</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-md bg-emerald-500" />
              <span className="font-medium text-slate-600">Encaissé</span>
            </div>
          </div>
        </div>

        {/* Graphique Recharts Client-Only */}
        <div className="h-80 w-full">
          {!mounted ? (
            <div className="h-full w-full bg-slate-50 animate-pulse rounded-xl" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorFacture" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPaye" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis
                  dataKey="month"
                  stroke="#94A3B8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  stroke="#94A3B8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${val / 1000}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="facturé"
                  name="Facturé"
                  stroke="#4F46E5"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorFacture)"
                />
                <Area
                  type="monotone"
                  dataKey="payé"
                  name="Encaissé"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorPaye)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Invoices List Card */}
      <div className="rounded-xl border border-slate-200/60 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-md font-bold text-slate-800 sm:text-lg">
              Factures récentes
            </h3>
            <p className="text-xs text-slate-400">
              Liste des 5 dernières transactions de facturation émises
            </p>
          </div>
          <Link
            href="/invoices"
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Voir tout
            <ArrowUpRight className="h-4.5 w-4.5" />
          </Link>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto -mx-6">
          <div className="inline-block min-w-full align-middle px-6">
            <table className="min-w-full divide-y divide-slate-100 table-auto">
              <thead>
                <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4">N° Facture</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Émission</th>
                  <th className="py-3 px-4">Échéance</th>
                  <th className="py-3 px-4 text-right">Montant</th>
                  <th className="py-3 px-4">Statut</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80">
                {invoices.slice(0, 5).map((inv) => {
                  const derivedStatus = getInvoiceStatus(inv);
                  const isMenuOpen = activeMenuId === inv.id;
                  const client = clients.find((c) => c.id === inv.clientId);
                  const clientName = client ? client.name : "Client Inconnu";
                  const clientEmail = client ? client.email : "";

                  return (
                    <tr
                      key={inv.id}
                      className="group text-sm text-slate-650 hover:bg-slate-50/60 transition-all duration-150"
                    >
                      {/* Numéro */}
                      <td className="py-3.5 px-4 font-semibold text-slate-850">
                        {inv.invoiceNumber}
                      </td>

                      {/* Client */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{clientName}</div>
                        <div className="text-xs text-slate-400">{clientEmail}</div>
                      </td>

                      {/* Date émission */}
                      <td className="py-3.5 px-4 text-slate-500">
                        {formatDateDisplay(inv.issueDate)}
                      </td>

                      {/* Date échéance */}
                      <td className="py-3.5 px-4 text-slate-500">
                        {formatDateDisplay(inv.dueDate)}
                      </td>

                      {/* Montant */}
                      <td className="py-3.5 px-4 text-right font-bold text-slate-800">
                        {formatFCFA(inv.total)}
                      </td>

                      {/* Statut badge */}
                      <td className="py-3.5 px-4">
                        <StatusBadge status={derivedStatus} />
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center relative">
                        <button
                          onClick={() =>
                            setActiveMenuId((prev) => (prev === inv.id ? null : inv.id))
                          }
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                          <MoreHorizontal className="h-4.5 w-4.5" />
                        </button>

                        {/* Action Dropdown Menu */}
                        {isMenuOpen && (
                          <>
                            {/* Hidden backdrop to close menu */}
                            <div
                              onClick={() => setActiveMenuId(null)}
                              className="fixed inset-0 z-10"
                            />
                            <div className="absolute right-4 mt-1 w-44 rounded-xl border border-slate-200/80 bg-white p-1.5 shadow-lg z-20 text-left">
                              <Link
                                href={`/invoices/${inv.id}`}
                                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                              >
                                <Eye className="h-4 w-4" />
                                Consulter
                              </Link>
                              <Link
                                href={`/invoices/${inv.id}/edit`}
                                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                              >
                                <Edit className="h-4 w-4" />
                                Modifier
                              </Link>
                              {derivedStatus !== "paid" && (
                                <button
                                  onClick={() => handleMarkAsPaid(inv.id)}
                                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors border-t border-slate-100 mt-1"
                                >
                                  <Check className="h-4 w-4" />
                                  Marquer payée
                                </button>
                              )}
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
