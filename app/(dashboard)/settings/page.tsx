"use client";

import { useState, useEffect } from "react";
import {
  Building2,
  Settings as SettingsIcon,
  Percent,
  Hash,
  Upload,
  Save,
  FileText
} from "lucide-react";
import { toast } from "sonner";
import { useAppStore } from "@/lib/store";

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);
  const settings = useAppStore((state) => state.settings);
  const saveSettings = useAppStore((state) => state.saveSettings);

  // States
  const [companyName, setCompanyName] = useState("Cansaas Agency");
  const [companyEmail, setCompanyEmail] = useState("contact@cansaas.com");
  const [companyPhone, setCompanyPhone] = useState("+221 77 123 45 67");
  const [companyAddress, setCompanyAddress] = useState("Dakar Almadies, Sénégal");
  const [defaultVat, setDefaultVat] = useState("18");
  const [invoicePrefix, setInvoicePrefix] = useState("FAC-2026-");
  const [paymentTerms, setPaymentTerms] = useState("30");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    if (settings) {
      setCompanyName(settings.companyName);
      setCompanyEmail(settings.companyEmail);
      setCompanyPhone(settings.companyPhone);
      setCompanyAddress(settings.companyAddress);
      setDefaultVat(String(settings.defaultVat));
      setInvoicePrefix(settings.invoicePrefix);
      setPaymentTerms(settings.paymentTerms);
      setLogoPreview(settings.logoPreview);
    }
  }, [settings]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Le logo ne doit pas dépasser 2 Mo.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        setLogoPreview(base64);
        try {
          await saveSettings({ logoPreview: base64 });
          toast.success("Logo chargé avec succès sur Supabase.");
        } catch (err) {
          toast.error("Erreur lors de la sauvegarde du logo.");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveSettings({
        companyName,
        companyEmail,
        companyPhone,
        companyAddress,
        defaultVat: Number(defaultVat),
        invoicePrefix,
        paymentTerms
      });
      toast.success("Paramètres de l'entreprise enregistrés sur Supabase !");
    } catch (err) {
      toast.error("Erreur lors de l'enregistrement des paramètres.");
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
    <form onSubmit={handleSave} className="space-y-7 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Paramètres généraux
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Configurez les informations d&apos;identité de votre entreprise et vos préférences de facturation.
          </p>
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-150 hover:bg-indigo-750 transition-all"
        >
          <Save className="h-4.5 w-4.5" />
          Sauvegarder
        </button>
      </div>

      {/* Main split forms */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Card: Company Profile & Logo */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-slate-200/60 bg-white p-6 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <Building2 className="h-4.5 w-4.5 text-indigo-500" />
              Profil de l&apos;Entreprise
            </h3>

            {/* Logo upload wrapper */}
            <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl bg-slate-50/50 border border-slate-200/50">
              <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                {logoPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logoPreview} alt="Logo" className="object-contain h-full w-full" />
                ) : (
                  <Building2 className="h-8 w-8 text-slate-300" />
                )}
              </div>
              <div className="space-y-1.5 text-center sm:text-left flex-1">
                <h4 className="text-xs font-bold text-slate-700">Logo de l&apos;organisation</h4>
                <p className="text-[11px] text-slate-400">
                  Format PNG ou JPG. Taille maximale de 2 Mo.
                </p>
                <label className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors mt-2 shadow-xs">
                  <Upload className="h-3.5 w-3.5" />
                  Charger une image
                  <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                </label>
              </div>
            </div>

            {/* Inputs Block */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Company Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Nom commercial
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-sm text-slate-700 focus:border-indigo-600 focus:bg-white outline-none transition-all"
                />
              </div>

              {/* Company Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Email de facturation
                </label>
                <input
                  type="email"
                  required
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-sm text-slate-700 focus:border-indigo-600 focus:bg-white outline-none transition-all"
                />
              </div>

              {/* Company Phone */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Numéro de téléphone
                </label>
                <input
                  type="text"
                  required
                  value={companyPhone}
                  onChange={(e) => setCompanyPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-sm text-slate-700 focus:border-indigo-600 focus:bg-white outline-none transition-all"
                />
              </div>

              {/* Company Address */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Adresse de l&apos;entreprise
                </label>
                <textarea
                  required
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-sm text-slate-700 focus:border-indigo-600 focus:bg-white outline-none transition-all resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Billing Preferences */}
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200/60 bg-white p-6 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <SettingsIcon className="h-4.5 w-4.5 text-indigo-500" />
              Préférences facturation
            </h3>

            {/* Default VAT Rate */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Percent className="h-3.5 w-3.5" />
                Taux TVA par défaut (%)
              </label>
              <select
                value={defaultVat}
                onChange={(e) => setDefaultVat(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3 text-sm text-slate-700 focus:border-indigo-600 focus:bg-white outline-none transition-all cursor-pointer"
              >
                <option value="18">18% (Taux Standard UEMOA)</option>
                <option value="10">10% (Taux Réduit)</option>
                <option value="0">0% (Exonéré)</option>
              </select>
            </div>

            {/* Invoice Prefix */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Hash className="h-3.5 w-3.5" />
                Préfixe numérotation
              </label>
              <input
                type="text"
                required
                value={invoicePrefix}
                onChange={(e) => setInvoicePrefix(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-sm text-slate-700 focus:border-indigo-600 focus:bg-white outline-none transition-all font-mono"
              />
              <p className="text-[10px] text-slate-400 leading-tight">
                Exemple généré : <span className="font-semibold text-slate-650">{invoicePrefix}0001</span>
              </p>
            </div>

            {/* Payment terms */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <FileText className="h-3.5 w-3.5" />
                Échéance par défaut
              </label>
              <select
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3 text-sm text-slate-700 focus:border-indigo-600 focus:bg-white outline-none transition-all cursor-pointer"
              >
                <option value="30">Sous 30 jours</option>
                <option value="15">Sous 15 jours</option>
                <option value="0">Paiement à réception</option>
              </select>
            </div>

            {/* Currency (Read-Only) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Devise par défaut
              </label>
              <div className="w-full rounded-xl border border-slate-200 bg-slate-100/50 py-2.5 px-3.5 text-sm text-slate-500 font-semibold select-none">
                Franc CFA (XOF)
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
