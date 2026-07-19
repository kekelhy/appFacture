"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Check,
  AlertTriangle,
  Filter
} from "lucide-react";
import { useAppStore, Invoice } from "@/lib/store";
import { formatFCFA } from "@/lib/calculations/money";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Status Badge
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

export default function InvoicesPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const invoices = useAppStore((state) => state.invoices);
  const clients = useAppStore((state) => state.clients);
  const updateInvoiceStatus = useAppStore((state) => state.updateInvoiceStatus);
  const deleteInvoice = useAppStore((state) => state.deleteInvoice);

  // States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "draft" | "sent" | "paid" | "overdue">("all");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const TODAY_STR = "2026-07-12";

  // Dériver le statut "en retard"
  const getInvoiceStatus = (invoice: Invoice): "draft" | "sent" | "paid" | "overdue" => {
    if (invoice.status === "sent" && invoice.dueDate < TODAY_STR) {
      return "overdue";
    }
    return invoice.status;
  };

  // Actions
  const handleMarkAsPaid = (id: string) => {
    updateInvoiceStatus(id, "paid");
    setActiveMenuId(null);
    toast.success("Facture marquée comme payée !");
  };

  const handleDelete = (id: string) => {
    deleteInvoice(id);
    setConfirmDeleteId(null);
    toast.success("Facture supprimée avec succès !");
  };

  // Filtrage
  const filteredInvoices = invoices.filter((inv) => {
    const client = clients.find((c) => c.id === inv.clientId);
    const clientName = client ? client.name.toLowerCase() : "";
    const invNumber = inv.invoiceNumber.toLowerCase();
    const query = searchQuery.toLowerCase();
    
    // Filtre textuel
    const matchesSearch = clientName.includes(query) || invNumber.includes(query);
    
    // Filtre statut
    const derivedStatus = getInvoiceStatus(inv);
    const matchesStatus = selectedStatus === "all" || derivedStatus === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  // Date format utility
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
            Factures
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Gerez la facturation de votre activite et suivez l&apos;etat des reglements.
          </p>
        </div>
        <Link
          href="/invoices/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-150 hover:bg-indigo-750 transition-all"
        >
          <Plus className="h-4.5 w-4.5" />
          Créer une facture
        </Link>
      </div>

      {/* Barre d'outils (Recherche + Filtres de Statuts) */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        {/* Recherche */}
        <div className="relative w-full lg:max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4.5 w-4.5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher un client ou n° de facture..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-600 transition-all shadow-xs"
          />
        </div>

        {/* Filtres de Statut (Tabs style) */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-100 w-fit">
          {(
            [
              { id: "all", label: "Tous" },
              { id: "draft", label: "Brouillon" },
              { id: "sent", label: "Envoyée" },
              { id: "paid", label: "Payée" },
              { id: "overdue", label: "En retard" }
            ] as const
          ).map((tab) => {
            const isActive = selectedStatus === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedStatus(tab.id)}
                className={cn(
                  "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all",
                  isActive
                    ? "bg-white text-slate-800 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tableau des factures */}
      <div className="rounded-xl border border-slate-200/60 bg-white p-6 shadow-xs">
        {filteredInvoices.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-450 mx-auto mb-4">
              <Filter className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-700">Aucune facture trouvée</h3>
            <p className="text-xs text-slate-400 mt-1">
              Essayez de modifier vos filtres ou de créer une nouvelle facture.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6">
            <div className="inline-block min-w-full align-middle px-6">
              <table className="min-w-full divide-y divide-slate-100 table-auto">
                <thead>
                  <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-4">N° Facture</th>
                    <th className="py-3 px-4">Client</th>
                    <th className="py-3 px-4">Date Émission</th>
                    <th className="py-3 px-4">Date Échéance</th>
                    <th className="py-3 px-4 text-right">Montant</th>
                    <th className="py-3 px-4">Statut</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/80">
                  {filteredInvoices.map((inv) => {
                    const derivedStatus = getInvoiceStatus(inv);
                    const isMenuOpen = activeMenuId === inv.id;
                    const client = clients.find((c) => c.id === inv.clientId);
                    const clientName = client ? client.name : "Client Inconnu";
                    const clientEmail = client ? client.email : "";

                    return (
                      <tr
                        key={inv.id}
                        onClick={() => router.push(`/invoices/${inv.id}`)}
                        className="group text-sm text-slate-650 hover:bg-slate-50/60 transition-all duration-150 cursor-pointer"
                      >
                        {/* Numéro */}
                        <td className="py-3.5 px-4 font-semibold text-slate-850 group-hover:text-indigo-600 transition-colors">
                          {inv.invoiceNumber}
                        </td>

                        {/* Client */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-800">{clientName}</div>
                          <div className="text-xs text-slate-450">{clientEmail}</div>
                        </td>

                        {/* Émission */}
                        <td className="py-3.5 px-4 text-slate-500">
                          {formatDateDisplay(inv.issueDate)}
                        </td>

                        {/* Échéance */}
                        <td className="py-3.5 px-4 text-slate-500">
                          {formatDateDisplay(inv.dueDate)}
                        </td>

                        {/* Montant */}
                        <td className="py-3.5 px-4 text-right font-bold text-slate-805">
                          {formatFCFA(inv.total)}
                        </td>

                        {/* Statut */}
                        <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                          <StatusBadge status={derivedStatus} />
                        </td>

                        {/* Actions */}
                        <td
                          className="py-3.5 px-4 text-center relative"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() =>
                              setActiveMenuId((prev) => (prev === inv.id ? null : inv.id))
                            }
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                          >
                            <MoreHorizontal className="h-4.5 w-4.5" />
                          </button>

                          {isMenuOpen && (
                            <>
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
                                <button
                                  onClick={() => {
                                    setConfirmDeleteId(inv.id);
                                    setActiveMenuId(null);
                                  }}
                                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 transition-colors border-t border-slate-100 mt-1"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Supprimer
                                </button>
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
        )}
      </div>

      {/* Confirmation Modal pour suppression */}
      {confirmDeleteId && (
        <>
          <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-sm" />
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
            <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-xl animate-scale-in">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600 mb-4">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-md font-bold text-slate-900">
                Supprimer la facture ?
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Cette action supprimera définitivement la facture et toutes ses lignes de services. Cette action est irréversible.
              </p>
              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleDelete(confirmDeleteId)}
                  className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-rose-200 hover:bg-rose-700 transition-all"
                >
                  Confirmer la suppression
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
