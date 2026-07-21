"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  Trash2,
  Calendar,
  User,
  Hash,
  Eye,
  ArrowLeft,
  AlertCircle
} from "lucide-react";
import { useAppStore, Invoice, InvoiceItem } from "@/lib/store";
import { formatFCFA } from "@/lib/calculations/money";
import { calculateInvoiceTotals } from "@/lib/calculations/invoice-totals";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface InvoiceFormProps {
  initialInvoice?: Invoice;
}

export default function InvoiceForm({ initialInvoice }: InvoiceFormProps) {
  const router = useRouter();
  const clients = useAppStore((state) => state.clients);
  const invoices = useAppStore((state) => state.invoices);
  const settings = useAppStore((state) => state.settings);
  const addInvoice = useAppStore((state) => state.addInvoice);
  const updateInvoice = useAppStore((state) => state.updateInvoice);

  // Responsive Show Preview State (inspired by "Show Preview" switch in Creatinf)
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setShowPreview(false);
    }
  }, []);

  // Form Fields State
  const [clientId, setClientId] = useState(initialInvoice?.clientId || "");
  const [issueDate, setIssueDate] = useState(initialInvoice?.issueDate || "2026-07-12");
  const [dueDate, setDueDate] = useState(initialInvoice?.dueDate || "2026-08-12");
  
  const [items, setItems] = useState<Omit<InvoiceItem, "id">[]>(
    initialInvoice?.items.map(item => ({
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice
    })) || [{ description: "", quantity: 1, unitPrice: 0 }]
  );

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Dynamic calculations for preview
  const totals = calculateInvoiceTotals(
    items.map(it => ({ quantity: it.quantity, unitPrice: it.unitPrice }))
  );

  const selectedClient = clients.find(c => c.id === clientId);

  // Auto-generate invoice number format
  const nextNum = invoices.length + 1;
  const invoiceNumberText = initialInvoice
    ? initialInvoice.invoiceNumber
    : `${settings.invoicePrefix}${String(nextNum).padStart(4, "0")}`;

  // Add Item Line
  const handleAddItem = () => {
    setItems([...items, { description: "", quantity: 1, unitPrice: 0 }]);
  };

  // Remove Item Line
  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  // Change Item Fields
  const handleItemChange = (index: number, fields: Partial<Omit<InvoiceItem, "id">>) => {
    setItems(
      items.map((item, i) => (i === index ? { ...item, ...fields } : item))
    );
  };

  // Validation
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!clientId) errors.client = "Veuillez sélectionner un client.";
    if (!issueDate) errors.issueDate = "La date d'émission est requise.";
    if (!dueDate) errors.dueDate = "La date d'échéance est requise.";
    if (dueDate < issueDate) errors.dueDate = "La date d'échéance doit être après l'émission.";
    
    // Validate lines
    items.forEach((item, index) => {
      if (!item.description.trim()) {
        errors[`item_${index}_desc`] = "Description requise.";
      }
      if (item.quantity <= 0) {
        errors[`item_${index}_qty`] = "Min 1.";
      }
      if (item.unitPrice < 0) {
        errors[`item_${index}_price`] = "Min 0.";
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save invoice
  const handleSave = (status: "draft" | "sent") => {
    if (!validateForm()) {
      toast.error("Veuillez corriger les erreurs dans le formulaire.");
      return;
    }

    const payload = {
      clientId,
      issueDate,
      dueDate,
      status,
      items: items.map(it => ({
        id: Math.random().toString(36).substr(2, 9),
        ...it
      }))
    };

    if (initialInvoice) {
      updateInvoice(initialInvoice.id, payload);
      toast.success(status === "sent" ? "Facture envoyée !" : "Facture mise à jour comme brouillon.");
    } else {
      addInvoice(payload);
      toast.success(status === "sent" ? "Facture créée et envoyée !" : "Facture sauvegardée comme brouillon.");
    }

    router.push("/invoices");
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Title Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
              Factures <span className="text-slate-300">/</span> {initialInvoice ? "Modifier" : "Créer"}
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl mt-1">
              {initialInvoice ? `Modifier la Facture ${initialInvoice.invoiceNumber}` : "Créer une facture"}
            </h2>
          </div>
        </div>

        {/* Toggle Preview Button & Save options */}
        <div className="flex items-center gap-4">
          {/* Show Preview switch */}
          <div className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-3.5 py-2">
            <span className="text-xs font-semibold text-slate-500">Afficher l&apos;aperçu</span>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={cn(
                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 outline-none",
                showPreview ? "bg-indigo-600" : "bg-slate-200"
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
                  showPreview ? "translate-x-5" : "translate-x-0"
                )}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Creation Form */}
        <div
          className={cn(
            "space-y-6 lg:transition-all lg:duration-300",
            showPreview ? "hidden lg:block lg:col-span-7" : "block lg:col-span-12"
          )}
        >
          {/* Main Form Fields Container */}
          <div className="rounded-xl border border-slate-200/60 bg-white p-6 shadow-xs space-y-6">
            {/* Standard/Split/Recurring Tabs */}
            <div className="flex rounded-xl bg-slate-100 p-1 w-full max-w-md">
              <button
                type="button"
                className="flex-1 rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-800 shadow-xs text-center"
              >
                Standard
              </button>
              <button
                type="button"
                disabled
                className="flex-1 rounded-lg px-3 py-2 text-xs font-medium text-slate-400 cursor-not-allowed text-center flex items-center justify-center gap-1.5"
              >
                Divisé
                <span className="rounded-full bg-slate-200 px-1.5 py-0.2 text-[8px] font-semibold text-slate-550">Bientôt</span>
              </button>
              <button
                type="button"
                disabled
                className="flex-1 rounded-lg px-3 py-2 text-xs font-medium text-slate-400 cursor-not-allowed text-center flex items-center justify-center gap-1.5"
              >
                Récurrent
                <span className="rounded-full bg-slate-200 px-1.5 py-0.2 text-[8px] font-semibold text-slate-550">Bientôt</span>
              </button>
            </div>

            {/* Informational block Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Client Selector (Billed To) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <User className="h-3.5 w-3.5" />
                  Client Facturé <span className="text-rose-500">*</span>
                </label>
                {clients.length === 0 ? (
                  <div className="text-xs text-rose-500 font-medium">
                    Aucun client disponible. Veuillez{" "}
                    <Link href="/clients" className="underline font-bold text-indigo-600">
                      créer un client
                    </Link>{" "}
                    d&apos;abord.
                  </div>
                ) : (
                  <select
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className={cn(
                      "w-full rounded-xl border bg-slate-50/50 py-2.5 px-3 text-sm text-slate-700 focus:border-indigo-600 focus:bg-white outline-none transition-all cursor-pointer",
                      formErrors.client ? "border-rose-300 bg-rose-50/10" : "border-slate-200"
                    )}
                  >
                    <option value="">Sélectionnez un client...</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.email})
                      </option>
                    ))}
                  </select>
                )}
                {formErrors.client && (
                  <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {formErrors.client}
                  </p>
                )}
              </div>

              {/* Read Only Invoice Number */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Hash className="h-3.5 w-3.5" />
                  Numéro de facture (Auto)
                </label>
                <div className="w-full rounded-xl border border-slate-200 bg-slate-100/50 py-2.5 px-3 text-sm text-slate-500 font-mono select-none">
                  {invoiceNumberText}
                </div>
              </div>

              {/* Date Issue */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Date d&apos;émission <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3 text-sm text-slate-700 focus:border-indigo-600 focus:bg-white outline-none transition-all"
                />
              </div>

              {/* Due Date */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Date d&apos;échéance <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className={cn(
                    "w-full rounded-xl border bg-slate-50/50 py-2.5 px-3 text-sm text-slate-700 focus:border-indigo-600 focus:bg-white outline-none transition-all",
                    formErrors.dueDate ? "border-rose-300 bg-rose-50/10" : "border-slate-200"
                  )}
                />
                {formErrors.dueDate && (
                  <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {formErrors.dueDate}
                  </p>
                )}
              </div>
            </div>

            {/* Locked Currency field */}
            <div className="pt-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Devise de Facturation
              </label>
              <div className="mt-1.5 w-fit rounded-xl border border-slate-200 bg-slate-50 py-1.5 px-3 text-xs font-semibold text-slate-600 flex items-center gap-2">
                <span className="text-base">🇸🇳</span>
                FCFA (XOF) - Verrouillé
              </div>
            </div>
          </div>

          {/* Section Dynamic Invoice Items */}
          <div className="rounded-xl border border-slate-200/60 bg-white p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Lignes de Prestation / Articles
              </h3>
              <span className="text-xs font-semibold text-slate-400">
                {items.length} {items.length > 1 ? "lignes" : "ligne"}
              </span>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => {
                const lineTotal = Math.round(item.quantity * item.unitPrice);
                
                return (
                  <div
                    key={index}
                    className="p-4 rounded-xl border border-slate-100 bg-slate-50/40 relative space-y-4 md:space-y-0 md:flex md:items-start md:gap-4 group"
                  >
                    {/* Index tag */}
                    <div className="absolute -left-2 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-500 md:static md:mt-2.5 md:-left-0">
                      {index + 1}
                    </div>

                    {/* Description */}
                    <div className="flex-1 space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider md:hidden">
                        Description / Service
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Conception d'identité visuelle..."
                        value={item.description}
                        onChange={(e) => handleItemChange(index, { description: e.target.value })}
                        className={cn(
                          "w-full rounded-lg border bg-white py-2 px-3 text-sm text-slate-700 outline-none focus:border-indigo-600 transition-all",
                          formErrors[`item_${index}_desc`] ? "border-rose-350 bg-rose-50/5" : "border-slate-200"
                        )}
                      />
                    </div>

                    {/* QTY */}
                    <div className="w-full md:w-20 space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider md:hidden">
                        Quantité
                      </label>
                      <input
                        type="number"
                        min="1"
                        placeholder="Qté"
                        value={item.quantity || ""}
                        onChange={(e) =>
                          handleItemChange(index, { quantity: Number(e.target.value) })
                        }
                        className={cn(
                          "w-full rounded-lg border bg-white py-2 px-3 text-sm text-slate-700 text-center outline-none focus:border-indigo-600 transition-all",
                          formErrors[`item_${index}_qty`] ? "border-rose-350" : "border-slate-200"
                        )}
                      />
                    </div>

                    {/* Unit Price */}
                    <div className="w-full md:w-36 space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider md:hidden">
                        Prix Unitaire
                      </label>
                      <input
                        type="number"
                        min="0"
                        placeholder="Prix en FCFA"
                        value={item.unitPrice || ""}
                        onChange={(e) =>
                          handleItemChange(index, { unitPrice: Number(e.target.value) })
                        }
                        className={cn(
                          "w-full rounded-lg border bg-white py-2 px-3 text-sm text-slate-700 text-right outline-none focus:border-indigo-600 transition-all",
                          formErrors[`item_${index}_price`] ? "border-rose-350" : "border-slate-200"
                        )}
                      />
                    </div>

                    {/* Line Total */}
                    <div className="w-full md:w-32 text-right md:pt-2">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider md:hidden">
                        Total Ligne
                      </div>
                      <div className="text-sm font-bold text-slate-800 md:h-9 md:flex md:items-center md:justify-end">
                        {formatFCFA(lineTotal)}
                      </div>
                    </div>

                    {/* Delete Line Button */}
                    <div className="flex justify-end md:pt-1">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        disabled={items.length <= 1}
                        className={cn(
                          "p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors",
                          items.length <= 1 ? "opacity-30 cursor-not-allowed" : ""
                        )}
                        title="Supprimer la ligne"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Line button */}
            <button
              type="button"
              onClick={handleAddItem}
              className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 hover:border-indigo-600 hover:bg-indigo-50/20 text-slate-500 hover:text-indigo-600 font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="h-4.5 w-4.5" />
              Ajouter une ligne
            </button>
          </div>

          {/* Form CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleSave("draft")}
              className="w-full sm:w-auto rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Sauvegarder comme brouillon
            </button>
            <button
              type="button"
              onClick={() => handleSave("sent")}
              className="w-full sm:w-auto rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-150 hover:bg-indigo-750 transition-all"
            >
              Envoyer la facture
            </button>
          </div>
        </div>

        {/* Right Side: Live Preview Panel */}
        {showPreview && (
          <div className="lg:col-span-5 w-full space-y-4 sticky top-20 animate-in fade-in slide-in-from-bottom duration-200">
            <div className="rounded-xl border border-slate-200/60 bg-white p-4 shadow-xs">
              <div className="text-xs font-semibold text-slate-400 mb-3 flex items-center gap-1.5 pb-2 border-b border-slate-100">
                <Eye className="h-4 w-4 text-indigo-500" />
                Aperçu en temps réel
              </div>

              {/* Invoice Canvas */}
              <div className="w-full bg-slate-50 p-4 sm:p-6 rounded-lg border border-slate-150 overflow-hidden">
                <div className="w-full bg-white p-6 shadow-sm border border-slate-200/50 rounded-md space-y-6 text-[11px] leading-relaxed max-w-[21cm] mx-auto aspect-[1/1.3] flex flex-col justify-between">
                  {/* Canvas Header */}
                  <div>
                    <div className="flex justify-between items-start gap-4">
                      {/* Company info */}
                      <div className="flex items-center gap-2.5">
                        {settings.logoPreview && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={settings.logoPreview} alt="Logo" className="h-9 w-9 object-contain rounded-lg border border-slate-200" />
                        )}
                        <div>
                          <div className="font-bold text-[13px] text-indigo-600">{settings.companyName}</div>
                          <div className="text-slate-450 mt-0.5 text-[10px]">{settings.companyAddress}</div>
                          <div className="text-slate-450 text-[10px]">{settings.companyPhone}</div>
                        </div>
                      </div>
                      
                      {/* Document title */}
                      <div className="text-right">
                        <div className="text-[16px] font-black text-slate-800 tracking-tight">FACTURE</div>
                        <div className="font-mono text-slate-500 font-semibold mt-1">N° {invoiceNumberText}</div>
                      </div>
                    </div>

                    <div className="h-px bg-slate-100 my-4" />

                    {/* Billed To / Dates block */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="font-semibold text-slate-400 uppercase tracking-wider text-[9px]">Destinataire :</div>
                        {selectedClient ? (
                          <div className="mt-1.5 space-y-0.5">
                            <div className="font-bold text-slate-800">{selectedClient.name}</div>
                            <div className="text-slate-450">{selectedClient.email}</div>
                            <div className="text-slate-450">{selectedClient.phone}</div>
                            <div className="text-slate-450 truncate max-w-[150px]">{selectedClient.address}</div>
                          </div>
                        ) : (
                          <div className="mt-1.5 text-slate-400 italic">Aucun client sélectionné</div>
                        )}
                      </div>

                      <div className="text-right">
                        <div className="font-semibold text-slate-400 uppercase tracking-wider text-[9px]">Détails temporels :</div>
                        <div className="mt-1.5 space-y-1 text-slate-600 font-semibold">
                          <div>Émise le : <span className="font-bold text-slate-700">{issueDate.split("-").reverse().join("/")}</span></div>
                          <div>Échéance : <span className="font-bold text-slate-750">{dueDate.split("-").reverse().join("/")}</span></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="flex-1 mt-6">
                    <table className="w-full text-left table-auto">
                      <thead>
                        <tr className="border-b-2 border-slate-200 text-slate-400 uppercase tracking-wider font-bold text-[8px] pb-1">
                          <th className="pb-1 text-left">Description</th>
                          <th className="pb-1 text-center w-10">Qté</th>
                          <th className="pb-1 text-right w-20">P.U. (FCFA)</th>
                          <th className="pb-1 text-right w-24">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {items.map((it, idx) => {
                          const itemTotal = Math.round(it.quantity * it.unitPrice);
                          return (
                            <tr key={idx} className="align-top">
                              <td className="py-2.5 pr-2 font-semibold text-slate-800 break-words max-w-[120px]">
                                {it.description || <span className="text-slate-300 italic">Sans description</span>}
                              </td>
                              <td className="py-2.5 text-center">{it.quantity}</td>
                              <td className="py-2.5 text-right font-mono">{formatFCFA(it.unitPrice).replace(" FCFA", "")}</td>
                              <td className="py-2.5 text-right font-mono font-bold text-slate-800">{formatFCFA(itemTotal).replace(" FCFA", "")}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary Totals Block */}
                  <div className="border-t border-slate-150 pt-4 flex justify-end">
                    <div className="w-48 space-y-1.5 text-right">
                      <div className="flex justify-between text-slate-500 font-semibold">
                        <span>Sous-total:</span>
                        <span className="font-bold text-slate-750 font-mono">{formatFCFA(totals.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-slate-500 font-semibold">
                        <span>TVA (18%):</span>
                        <span className="font-bold text-slate-750 font-mono">{formatFCFA(totals.vatAmount)}</span>
                      </div>
                      <div className="h-px bg-slate-100 my-1" />
                      <div className="flex justify-between text-slate-800 font-extrabold text-[12px] pt-1">
                        <span>TOTAL TTC:</span>
                        <span className="text-indigo-600 font-mono">{formatFCFA(totals.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Note footer */}
                  <div className="text-center text-[9px] text-slate-400 mt-6 border-t border-slate-100 pt-3">
                    Merci pour votre collaboration ! Paiement attendu sous 30 jours à compter de la date d&apos;émission.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
