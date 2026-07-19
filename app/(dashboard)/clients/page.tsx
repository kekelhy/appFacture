"use client";

import { useState, useEffect } from "react";
import {
  UserPlus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  X,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
  FileText
} from "lucide-react";
import { useAppStore, Client } from "@/lib/store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function ClientsPage() {
  const [mounted, setMounted] = useState(false);
  const clients = useAppStore((state) => state.clients);
  const invoices = useAppStore((state) => state.invoices);
  const addClient = useAppStore((state) => state.addClient);
  const updateClient = useAppStore((state) => state.updateClient);
  const deleteClient = useAppStore((state) => state.deleteClient);

  // States
  const [searchQuery, setSearchQuery] = useState("");
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  // Ouvrir le formulaire pour ajouter
  const handleOpenAdd = () => {
    setEditingClient(null);
    setFormData({ name: "", email: "", phone: "", address: "" });
    setFormErrors({});
    setIsSlideOverOpen(true);
  };

  // Ouvrir le formulaire pour modifier
  const handleOpenEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      address: client.address
    });
    setFormErrors({});
    setIsSlideOverOpen(true);
    setActiveMenuId(null);
  };

  // Validation
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Le nom est obligatoire.";
    if (!formData.email.trim()) {
      errors.email = "L'adresse email est obligatoire.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "L'adresse email n'est pas valide.";
    }
    if (!formData.phone.trim()) errors.phone = "Le numéro de téléphone est obligatoire.";
    if (!formData.address.trim()) errors.address = "L'adresse physique est obligatoire.";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Soumission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingClient) {
      updateClient(editingClient.id, formData);
      toast.success("Client mis à jour avec succès !");
    } else {
      addClient(formData);
      toast.success("Client créé avec succès !");
    }
    
    setIsSlideOverOpen(false);
  };

  // Suppression
  const handleDelete = (id: string) => {
    deleteClient(id);
    setConfirmDeleteId(null);
    toast.success("Client supprimé avec succès !");
  };

  // Filtrage des clients
  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Compter le nombre de factures associées
  const getInvoiceCount = (clientId: string) => {
    return invoices.filter((inv) => inv.clientId === clientId).length;
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
            Gestion des Clients
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Visualisez, modifiez et gérez la liste de vos clients facturables.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-150 hover:bg-indigo-750 transition-all duration-200"
        >
          <UserPlus className="h-4.5 w-4.5" />
          Ajouter un client
        </button>
      </div>

      {/* Barre de recherche */}
      <div className="relative max-w-md">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4.5 w-4.5 text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Rechercher par nom ou email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-600 transition-all shadow-xs"
        />
      </div>

      {/* Tableau des clients */}
      <div className="rounded-xl border border-slate-200/60 bg-white p-6 shadow-xs">
        {filteredClients.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-450 mx-auto mb-4">
              <Mail className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-700">Aucun client trouvé</h3>
            <p className="text-xs text-slate-400 mt-1">
              Modifiez votre recherche ou ajoutez un nouveau profil client.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6">
            <div className="inline-block min-w-full align-middle px-6">
              <table className="min-w-full divide-y divide-slate-100 table-auto">
                <thead>
                  <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-4">Client</th>
                    <th className="py-3 px-4">Téléphone</th>
                    <th className="py-3 px-4">Adresse</th>
                    <th className="py-3 px-4 text-center">Factures</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/80">
                  {filteredClients.map((client) => {
                    const isMenuOpen = activeMenuId === client.id;
                    const invoiceCount = getInvoiceCount(client.id);

                    return (
                      <tr
                        key={client.id}
                        className="group text-sm text-slate-650 hover:bg-slate-50/60 transition-all duration-150"
                      >
                        {/* Identité client */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-800">{client.name}</div>
                          <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <Mail className="h-3 w-3 text-slate-350" />
                            {client.email}
                          </div>
                        </td>

                        {/* Téléphone */}
                        <td className="py-3.5 px-4 font-medium text-slate-600">
                          <div className="flex items-center gap-1.5">
                            <Phone className="h-3.5 w-3.5 text-slate-400" />
                            {client.phone}
                          </div>
                        </td>

                        {/* Adresse */}
                        <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">
                          <div className="flex items-center gap-1.5" title={client.address}>
                            <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{client.address}</span>
                          </div>
                        </td>

                        {/* Nombre de factures */}
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                            <FileText className="h-3.5 w-3.5 text-slate-450" />
                            {invoiceCount}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-center relative">
                          <button
                            onClick={() =>
                              setActiveMenuId((prev) => (prev === client.id ? null : client.id))
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
                              <div className="absolute right-4 mt-1 w-40 rounded-xl border border-slate-200/80 bg-white p-1.5 shadow-lg z-20 text-left">
                                <button
                                  onClick={() => handleOpenEdit(client)}
                                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                >
                                  <Edit className="h-4 w-4" />
                                  Modifier
                                </button>
                                <button
                                  onClick={() => {
                                    setConfirmDeleteId(client.id);
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

      {/* Slide-over (Tiroir de Formulaire) */}
      {isSlideOverOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setIsSlideOverOpen(false)}
            className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer container */}
          <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md bg-white border-l border-slate-200 shadow-2xl p-6 flex-col animate-slide-in">
            {/* Header Form */}
            <div className="flex items-center justify-between pb-5 border-b border-slate-100">
              <h3 className="text-md font-bold text-slate-900">
                {editingClient ? "Modifier le Client" : "Nouveau Client"}
              </h3>
              <button
                onClick={() => setIsSlideOverOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-6 space-y-5">
              {/* Nom complet */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Nom du Client / Entreprise
                </label>
                <input
                  type="text"
                  placeholder="Ex: Cansaas Agency"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={cn(
                    "w-full rounded-xl border bg-slate-50/50 py-2.5 px-3.5 text-sm text-slate-700 placeholder-slate-450 focus:border-indigo-600 focus:bg-white transition-all outline-none",
                    formErrors.name ? "border-rose-300 focus:border-rose-500 bg-rose-50/10" : "border-slate-200"
                  )}
                />
                {formErrors.name && (
                  <p className="text-xs font-semibold text-rose-500 mt-1 flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {formErrors.name}
                  </p>
                )}
              </div>

              {/* Adresse Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Adresse Email
                </label>
                <input
                  type="email"
                  placeholder="Ex: contact@cansaas.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={cn(
                    "w-full rounded-xl border bg-slate-50/50 py-2.5 px-3.5 text-sm text-slate-700 placeholder-slate-450 focus:border-indigo-600 focus:bg-white transition-all outline-none",
                    formErrors.email ? "border-rose-300 focus:border-rose-500 bg-rose-50/10" : "border-slate-200"
                  )}
                />
                {formErrors.email && (
                  <p className="text-xs font-semibold text-rose-500 mt-1 flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {formErrors.email}
                  </p>
                )}
              </div>

              {/* Téléphone */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Numéro de Téléphone
                </label>
                <input
                  type="text"
                  placeholder="Ex: +221 77 123 45 67"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={cn(
                    "w-full rounded-xl border bg-slate-50/50 py-2.5 px-3.5 text-sm text-slate-700 placeholder-slate-450 focus:border-indigo-600 focus:bg-white transition-all outline-none",
                    formErrors.phone ? "border-rose-300 focus:border-rose-500 bg-rose-50/10" : "border-slate-200"
                  )}
                />
                {formErrors.phone && (
                  <p className="text-xs font-semibold text-rose-500 mt-1 flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {formErrors.phone}
                  </p>
                )}
              </div>

              {/* Adresse Physique */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Adresse Physique
                </label>
                <textarea
                  placeholder="Ex: Dakar Almadies, Sénégal"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                  className={cn(
                    "w-full rounded-xl border bg-slate-50/50 py-2.5 px-3.5 text-sm text-slate-700 placeholder-slate-455 focus:border-indigo-600 focus:bg-white transition-all outline-none resize-none",
                    formErrors.address ? "border-rose-300 focus:border-rose-500 bg-rose-50/10" : "border-slate-200"
                  )}
                />
                {formErrors.address && (
                  <p className="text-xs font-semibold text-rose-500 mt-1 flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {formErrors.address}
                  </p>
                )}
              </div>
            </form>

            {/* Footer Form */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsSlideOverOpen(false)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-150 hover:bg-indigo-750 transition-all"
              >
                {editingClient ? "Enregistrer" : "Créer le client"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Confirmation Modal de suppression */}
      {confirmDeleteId && (
        <>
          {/* Modal Backdrop */}
          <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-sm" />
          
          {/* Modal Dialog */}
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
            <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-xl animate-scale-in">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600 mb-4">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-md font-bold text-slate-900">
                Supprimer le client ?
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Cette action supprimera définitivement le profil client et est irréversible. Les factures existantes de ce client ne seront pas effacées.
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
