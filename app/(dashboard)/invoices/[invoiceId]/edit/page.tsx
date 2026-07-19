"use client";

import { useAppStore } from "@/lib/store";
import InvoiceForm from "@/components/features/invoices/invoice-form";

export default function EditInvoicePage({ params }: { params: { invoiceId: string } }) {
  const invoices = useAppStore((state) => state.invoices);
  const invoice = invoices.find((inv) => inv.id === params.invoiceId);

  if (!invoice) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500 max-w-2xl mx-auto mt-10">
        <h3 className="text-sm font-bold text-slate-700">Facture introuvable</h3>
        <p className="text-xs text-slate-400 mt-1">La facture demandée n&apos;existe pas ou a été supprimée.</p>
      </div>
    );
  }

  return <InvoiceForm initialInvoice={invoice} />;
}
