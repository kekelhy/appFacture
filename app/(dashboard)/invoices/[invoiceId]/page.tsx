"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Mail,
  Download,
  AlertTriangle,
  ChevronDown
} from "lucide-react";
import { useAppStore, Invoice } from "@/lib/store";
import { formatFCFA } from "@/lib/calculations/money";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Local Status Badge Config
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

export default function InvoiceDetailPage({ params }: { params: { invoiceId: string } }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const invoices = useAppStore((state) => state.invoices);
  const clients = useAppStore((state) => state.clients);
  const settings = useAppStore((state) => state.settings);
  const updateInvoiceStatus = useAppStore((state) => state.updateInvoiceStatus);
  const deleteInvoice = useAppStore((state) => state.deleteInvoice);

  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const invoice = invoices.find((inv) => inv.id === params.invoiceId);
  const client = invoice ? clients.find((c) => c.id === invoice.clientId) : null;

  const TODAY_STR = "2026-07-12";
  const getInvoiceStatus = (inv: Invoice): "draft" | "sent" | "paid" | "overdue" => {
    if (inv.status === "sent" && inv.dueDate < TODAY_STR) {
      return "overdue";
    }
    return inv.status;
  };

  if (!invoice) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500 max-w-2xl mx-auto mt-10">
        <h3 className="text-sm font-bold text-slate-700">Facture introuvable</h3>
        <p className="text-xs text-slate-400 mt-1">La facture demandée n&apos;existe pas ou a été supprimée.</p>
        <button
          onClick={() => router.push("/invoices")}
          className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 hover:underline"
        >
          Retourner aux factures
        </button>
      </div>
    );
  }

  const derivedStatus = getInvoiceStatus(invoice);

  // Status transitions handler
  const handleStatusChange = (newStatus: "draft" | "sent" | "paid") => {
    updateInvoiceStatus(invoice.id, newStatus);
    setIsStatusDropdownOpen(false);
    toast.success(`Statut de la facture mis à jour : ${newStatus === "paid" ? "Payée" : newStatus === "sent" ? "Envoyée" : "Brouillon"}`);
  };

  const handleDelete = () => {
    deleteInvoice(invoice.id);
    toast.success("Facture supprimée avec succès.");
    router.push("/invoices");
  };

  // Date format helper
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
    <div className="space-y-6 max-w-6xl mx-auto relative">
      {/* Title block with back button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/invoices")}
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Factures <span className="text-slate-300">/</span> Détails
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl mt-1">
              Facture {invoice.invoiceNumber}
            </h2>
          </div>
        </div>

        {/* Quick status display */}
        <div className="flex items-center gap-2">
          <StatusBadge status={derivedStatus} />
        </div>
      </div>

      {/* Main split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Complete Invoice Layout Sheet */}
        <div className="lg:col-span-8 w-full bg-white border border-slate-200/60 p-6 sm:p-10 shadow-xs rounded-xl">
          {/* Invoice Render Page */}
          <div className="space-y-8 text-xs text-slate-650 max-w-[21cm] mx-auto">
            {/* Header info */}
            <div className="flex justify-between items-start gap-4">
              <div className="flex items-center gap-2.5">
                {settings.logoPreview && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={settings.logoPreview} alt="Logo" className="h-9 w-9 object-contain rounded-lg border border-slate-200" />
                )}
                <div>
                  <div className="font-extrabold text-[15px] text-indigo-600">{settings.companyName}</div>
                  <div className="text-slate-450 mt-0.5">{settings.companyAddress}</div>
                  <div className="text-slate-450">{settings.companyEmail} | {settings.companyPhone}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[20px] font-black text-slate-800 tracking-tight">FACTURE</div>
                <div className="font-mono text-slate-500 font-bold mt-1">N° {invoice.invoiceNumber}</div>
              </div>
            </div>

            <div className="h-px bg-slate-100" />

            {/* Bill To & Dates Block */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="font-bold text-slate-400 uppercase tracking-wider text-[9px]">Destinataire :</div>
                {client ? (
                  <div className="mt-2 space-y-1">
                    <div className="font-bold text-slate-800 text-[12px]">{client.name}</div>
                    <div className="text-slate-450">{client.email}</div>
                    <div className="text-slate-450">{client.phone}</div>
                    <div className="text-slate-450 mt-1 whitespace-pre-line">{client.address}</div>
                  </div>
                ) : (
                  <div className="mt-2 text-slate-400 italic">Client introuvable</div>
                )}
              </div>

              <div className="text-right">
                <div className="font-bold text-slate-400 uppercase tracking-wider text-[9px]">Détails temporels :</div>
                <div className="mt-2 space-y-1.5 text-slate-600 font-semibold">
                  <div>Émise le : <span className="font-bold text-slate-700">{formatDateDisplay(invoice.issueDate)}</span></div>
                  <div>Échéance : <span className="font-bold text-slate-750">{formatDateDisplay(invoice.dueDate)}</span></div>
                </div>
              </div>
            </div>

            {/* Items list Table */}
            <div className="pt-4">
              <table className="w-full text-left table-auto">
                <thead>
                  <tr className="border-b-2 border-slate-200 text-slate-400 uppercase tracking-wider font-bold text-[8px] pb-1">
                    <th className="pb-1.5">Description</th>
                    <th className="pb-1.5 text-center w-12">Qté</th>
                    <th className="pb-1.5 text-right w-28">P.U. (FCFA)</th>
                    <th className="pb-1.5 text-right w-32">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {invoice.items.map((it) => {
                    const itemTotal = Math.round(it.quantity * it.unitPrice);
                    return (
                      <tr key={it.id}>
                        <td className="py-3 pr-2 font-semibold text-slate-800 break-words">
                          {it.description}
                        </td>
                        <td className="py-3 text-center">{it.quantity}</td>
                        <td className="py-3 text-right font-mono">{formatFCFA(it.unitPrice).replace(" FCFA", "")}</td>
                        <td className="py-3 text-right font-mono font-bold text-slate-805">{formatFCFA(itemTotal).replace(" FCFA", "")}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Summary Block */}
            <div className="border-t border-slate-150 pt-4 flex justify-end">
              <div className="w-60 space-y-1.5 text-right">
                <div className="flex justify-between text-slate-500 font-semibold">
                  <span>Sous-total:</span>
                  <span className="font-bold text-slate-750 font-mono">{formatFCFA(invoice.subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-500 font-semibold">
                  <span>TVA (18%):</span>
                  <span className="font-bold text-slate-750 font-mono">{formatFCFA(invoice.vatAmount)}</span>
                </div>
                <div className="h-px bg-slate-100 my-1" />
                <div className="flex justify-between text-slate-800 font-extrabold text-[13px] pt-1">
                  <span>TOTAL TTC:</span>
                  <span className="text-indigo-600 font-mono">{formatFCFA(invoice.total)}</span>
                </div>
              </div>
            </div>

            {/* Note footer */}
            <div className="text-center text-[9px] text-slate-400 mt-10 border-t border-slate-100 pt-3">
              Merci pour votre collaboration ! Paiement attendu sous 30 jours à compter de la date d&apos;émission.
            </div>
          </div>
        </div>

        {/* Right: Actions Column */}
        <div className="lg:col-span-4 space-y-5">
          {/* Status management block */}
          <div className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-xs">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Gestion du statut
            </h3>
            
            <div className="relative">
              <button
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                className="w-full flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all outline-none"
              >
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "h-2 w-2 rounded-full",
                    invoice.status === "paid" ? "bg-emerald-500" : invoice.status === "sent" ? "bg-sky-500" : "bg-slate-400"
                  )} />
                  {invoice.status === "paid" ? "Payée" : invoice.status === "sent" ? "Envoyée" : "Brouillon"}
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>

              {isStatusDropdownOpen && (
                <>
                  <div
                    onClick={() => setIsStatusDropdownOpen(false)}
                    className="fixed inset-0 z-10"
                  />
                  <div className="absolute left-0 mt-1.5 w-full rounded-xl border border-slate-200/80 bg-white p-1.5 shadow-lg z-20 space-y-0.5">
                    <button
                      onClick={() => handleStatusChange("draft")}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                      Brouillon
                    </button>
                    <button
                      onClick={() => handleStatusChange("sent")}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                      Envoyée
                    </button>
                    <button
                      onClick={() => handleStatusChange("paid")}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Payée
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Core Actions Card */}
          <div className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Actions
            </h3>

            {/* Edit Invoice link */}
            <Link
              href={`/invoices/${invoice.id}/edit`}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              <Edit className="h-4.5 w-4.5" />
              Modifier la facture
            </Link>

            {/* Decorative print/download */}
            <button
              onClick={() => toast.info("Génération du PDF... (Disponible prochainement en Phase 3)")}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              <Download className="h-4.5 w-4.5" />
              Télécharger PDF
            </button>

            {/* Decorative send email */}
            <button
              onClick={() => toast.info("Envoi de l'email... (Disponible prochainement en Phase 3)")}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              <Mail className="h-4.5 w-4.5" />
              Envoyer par email
            </button>

            <div className="h-px bg-slate-100 my-2" />

            {/* Delete button */}
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-50 border border-rose-250 text-rose-700 px-4 py-2.5 text-sm font-semibold hover:bg-rose-100 transition-all"
            >
              <Trash2 className="h-4.5 w-4.5" />
              Supprimer la facture
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
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
                  onClick={() => setConfirmDelete(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDelete}
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
