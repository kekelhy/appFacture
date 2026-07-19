import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "./supabase";
import { calculateInvoiceTotals, InvoiceItemInput } from "./calculations/invoice-totals";

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  issueDate: string; // Format YYYY-MM-DD
  dueDate: string;   // Format YYYY-MM-DD
  status: "draft" | "sent" | "paid";
  items: InvoiceItem[];
  subtotal: number;
  vatAmount: number;
  total: number;
}

export interface Settings {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  defaultVat: number;
  invoicePrefix: string;
  paymentTerms: string;
  logoPreview: string | null;
}

export interface Transaction {
  id: string;
  type: "income" | "expense";
  description: string;
  amount: number;
  date: string; // Format YYYY-MM-DD
  category: string;
}

export interface Budget {
  id: string;
  category: string;
  limitAmount: number;
  period: string;
}

export interface UserSession {
  id: string;
  email: string;
}

interface AppState {
  clients: Client[];
  invoices: Invoice[];
  transactions: Transaction[];
  budgets: Budget[];
  settings: Settings;
  user: UserSession | null;
  isLoading: boolean;
  theme: "light" | "dark";
  
  // App initialization
  fetchInitialData: () => Promise<void>;
  
  // Auth actions
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  listenToAuthChanges: () => void;
  
  // Actions Clients
  addClient: (client: Omit<Client, "id">) => Promise<Client>;
  updateClient: (id: string, client: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  
  // Actions Factures
  addInvoice: (invoice: Omit<Invoice, "id" | "invoiceNumber" | "subtotal" | "vatAmount" | "total">) => Promise<Invoice>;
  updateInvoice: (id: string, invoice: Partial<Omit<Invoice, "id" | "invoiceNumber">>) => Promise<void>;
  updateInvoiceStatus: (id: string, status: "draft" | "sent" | "paid") => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;
  
  // Actions Transactions
  addTransaction: (t: Omit<Transaction, "id">) => Promise<Transaction>;
  deleteTransaction: (id: string) => Promise<void>;
  
  // Actions Budgets
  updateBudget: (category: string, limitAmount: number) => Promise<void>;
  
  // Actions Paramètres
  saveSettings: (settings: Partial<Settings>) => Promise<void>;
  
  toggleTheme: () => void;
}

const DEFAULT_SETTINGS: Settings = {
  companyName: "Cansaas Agency",
  companyEmail: "contact@cansaas.com",
  companyPhone: "+221 77 123 45 67",
  companyAddress: "Dakar Almadies, Sénégal",
  defaultVat: 18,
  invoicePrefix: "FAC-2026-",
  paymentTerms: "30",
  logoPreview: null
};

// Map DB names to Frontend names
const mapDbInvoiceToInvoice = (dbInv: any): Invoice => ({
  id: dbInv.id,
  invoiceNumber: dbInv.invoice_number,
  clientId: dbInv.client_id,
  issueDate: dbInv.issue_date,
  dueDate: dbInv.due_date,
  status: dbInv.status,
  subtotal: Number(dbInv.subtotal),
  vatAmount: Number(dbInv.vat_amount),
  total: Number(dbInv.total),
  items: (dbInv.invoice_items || []).map((it: any) => ({
    id: it.id,
    description: it.description,
    quantity: Number(it.quantity),
    unitPrice: Number(it.unit_price)
  }))
});

const mapDbSettingsToSettings = (dbSettings: any): Settings => ({
  companyName: dbSettings.company_name || DEFAULT_SETTINGS.companyName,
  companyEmail: dbSettings.company_email || DEFAULT_SETTINGS.companyEmail,
  companyPhone: dbSettings.company_phone || DEFAULT_SETTINGS.companyPhone,
  companyAddress: dbSettings.company_address || DEFAULT_SETTINGS.companyAddress,
  defaultVat: Number(dbSettings.default_vat) || DEFAULT_SETTINGS.defaultVat,
  invoicePrefix: dbSettings.invoice_prefix || DEFAULT_SETTINGS.invoicePrefix,
  paymentTerms: dbSettings.payment_terms || DEFAULT_SETTINGS.paymentTerms,
  logoPreview: dbSettings.logo_preview || null
});

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      clients: [],
      invoices: [],
      transactions: [],
      budgets: [],
      settings: DEFAULT_SETTINGS,
      user: null,
      isLoading: true,
      theme: "light",
      
      toggleTheme: () => {
        set((state) => ({ theme: state.theme === "light" ? "dark" : "light" }));
      },
      
      listenToAuthChanges: () => {
        // Register connection changes
        supabase.auth.onAuthStateChange((event, session) => {
          if (session?.user) {
            set({
              user: {
                id: session.user.id,
                email: session.user.email || ""
              }
            });
          } else {
            set({ user: null });
          }
        });
      },

      signIn: async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      },

      signUp: async (email, password) => {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      },

      signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        set({ user: null });
      },

      fetchInitialData: async () => {
        set({ isLoading: true });
        try {
          // Check current session
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            set({
              user: {
                id: session.user.id,
                email: session.user.email || ""
              }
            });
          }

          // 1. Fetch Clients
          const { data: clientsData, error: clientsError } = await supabase
            .from("clients")
            .select("*")
            .order("name", { ascending: true });
          if (clientsError) throw clientsError;

          // 2. Fetch Invoices and Items
          const { data: invoicesData, error: invoicesError } = await supabase
            .from("invoices")
            .select("*, invoice_items(*)")
            .order("created_at", { ascending: false });
          if (invoicesError) throw invoicesError;

          // 3. Fetch Settings
          const { data: settingsData, error: settingsError } = await supabase
            .from("settings")
            .select("*")
            .limit(1);
          
          let parsedSettings = DEFAULT_SETTINGS;
          if (!settingsError && settingsData && settingsData.length > 0) {
            parsedSettings = mapDbSettingsToSettings(settingsData[0]);
          } else if (settingsData && settingsData.length === 0) {
            const { data: seededSettings } = await supabase
              .from("settings")
              .insert({
                company_name: DEFAULT_SETTINGS.companyName,
                company_email: DEFAULT_SETTINGS.companyEmail,
                company_phone: DEFAULT_SETTINGS.companyPhone,
                company_address: DEFAULT_SETTINGS.companyAddress,
                default_vat: DEFAULT_SETTINGS.defaultVat,
                invoice_prefix: DEFAULT_SETTINGS.invoicePrefix,
                payment_terms: DEFAULT_SETTINGS.paymentTerms
              })
              .select()
              .single();
            if (seededSettings) {
              parsedSettings = mapDbSettingsToSettings(seededSettings);
            }
          }

          // 4. Fetch Transactions
          const { data: transData, error: transError } = await supabase
            .from("transactions")
            .select("*")
            .order("date", { ascending: false });
          if (transError) throw transError;

          // 5. Fetch Budgets
          const { data: budgetsData, error: budgetsError } = await supabase
            .from("budgets")
            .select("*");
          if (budgetsError) throw budgetsError;

          set({
            clients: (clientsData || []).map((c: any) => ({
              id: c.id,
              name: c.name,
              email: c.email,
              phone: c.phone || "",
              address: c.address || ""
            })),
            invoices: (invoicesData || []).map(mapDbInvoiceToInvoice),
            transactions: (transData || []).map((t: any) => ({
              id: t.id,
              type: t.type,
              description: t.description,
              amount: Number(t.amount),
              date: t.date,
              category: t.category
            })),
            budgets: (budgetsData || []).map((b: any) => ({
              id: b.id,
              category: b.category,
              limitAmount: Number(b.limit_amount),
              period: b.period
            })),
            settings: parsedSettings,
            isLoading: false
          });
        } catch (error) {
          console.error("Error fetching initial data from Supabase:", error);
          set({ isLoading: false });
        }
      },
      
      // Actions Clients
      addClient: async (clientData) => {
        const { data, error } = await supabase
          .from("clients")
          .insert({
            name: clientData.name,
            email: clientData.email,
            phone: clientData.phone,
            address: clientData.address
          })
          .select()
          .single();
        if (error) throw error;

        const newClient: Client = {
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone || "",
          address: data.address || ""
        };

        set((state) => ({
          clients: [...state.clients, newClient]
        }));
        return newClient;
      },
      
      updateClient: async (id, updatedFields) => {
        const { error } = await supabase
          .from("clients")
          .update({
            name: updatedFields.name,
            email: updatedFields.email,
            phone: updatedFields.phone,
            address: updatedFields.address
          })
          .eq("id", id);
        if (error) throw error;

        set((state) => ({
          clients: state.clients.map((c) => (c.id === id ? { ...c, ...updatedFields } : c))
        }));
      },
      
      deleteClient: async (id) => {
        const { error } = await supabase
          .from("clients")
          .delete()
          .eq("id", id);
        if (error) throw error;

        set((state) => ({
          clients: state.clients.filter((c) => c.id !== id)
        }));
      },
      
      // Actions Factures
      addInvoice: async (invoiceData) => {
        const settings = get().settings;
        const { count, error: countError } = await supabase
          .from("invoices")
          .select("id", { count: "exact", head: true });
        if (countError) throw countError;

        const nextNum = (count || 0) + 1;
        const formattedNum = `${settings.invoicePrefix}${String(nextNum).padStart(4, "0")}`;
        const totals = calculateInvoiceTotals(invoiceData.items as InvoiceItemInput[]);
        
        const { data: invData, error: invError } = await supabase
          .from("invoices")
          .insert({
            invoice_number: formattedNum,
            client_id: invoiceData.clientId,
            issue_date: invoiceData.issueDate,
            due_date: invoiceData.dueDate,
            status: invoiceData.status,
            subtotal: totals.subtotal,
            vat_amount: totals.vatAmount,
            total: totals.total
          })
          .select()
          .single();
        if (invError) throw invError;

        const itemsToInsert = invoiceData.items.map((it: any) => ({
          invoice_id: invData.id,
          description: it.description,
          quantity: Number(it.quantity),
          unit_price: Number(it.unitPrice)
        }));
        
        const { data: itemsData, error: itemsError } = await supabase
          .from("invoice_items")
          .insert(itemsToInsert)
          .select();
        if (itemsError) throw itemsError;

        const newInvoice: Invoice = mapDbInvoiceToInvoice({
          ...invData,
          invoice_items: itemsData
        });
        
        set((state) => ({
          invoices: [newInvoice, ...state.invoices]
        }));
        
        return newInvoice;
      },
      
      updateInvoice: async (id, updatedFields) => {
        let totals = {};
        if (updatedFields.items) {
          totals = calculateInvoiceTotals(updatedFields.items as InvoiceItemInput[]);
        }

        const { error: invError } = await supabase
          .from("invoices")
          .update({
            client_id: updatedFields.clientId,
            issue_date: updatedFields.issueDate,
            due_date: updatedFields.dueDate,
            status: updatedFields.status,
            ...totals
          })
          .eq("id", id);
        if (invError) throw invError;

        if (updatedFields.items) {
          const { error: delError } = await supabase
            .from("invoice_items")
            .delete()
            .eq("invoice_id", id);
          if (delError) throw delError;

          const itemsToInsert = updatedFields.items.map((it: any) => ({
            invoice_id: id,
            description: it.description,
            quantity: Number(it.quantity),
            unit_price: Number(it.unitPrice)
          }));
          const { data: itemsData, error: insError } = await supabase
            .from("invoice_items")
            .insert(itemsToInsert)
            .select();
          if (insError) throw insError;

          set((state) => ({
            invoices: state.invoices.map((inv) => {
              if (inv.id !== id) return inv;
              return mapDbInvoiceToInvoice({
                ...inv,
                ...updatedFields,
                ...totals,
                invoice_items: itemsData
              });
            })
          }));
        } else {
          set((state) => ({
            invoices: state.invoices.map((inv) => {
              if (inv.id !== id) return inv;
              return {
                ...inv,
                ...updatedFields
              };
            })
          }));
        }
      },
      
      updateInvoiceStatus: async (id, status) => {
        const { error } = await supabase
          .from("invoices")
          .update({ status })
          .eq("id", id);
        if (error) throw error;

        set((state) => ({
          invoices: state.invoices.map((inv) => (inv.id === id ? { ...inv, status } : inv))
        }));
      },
      
      deleteInvoice: async (id) => {
        const { error } = await supabase
          .from("invoices")
          .delete()
          .eq("id", id);
        if (error) throw error;

        set((state) => ({
          invoices: state.invoices.filter((inv) => inv.id !== id)
        }));
      },

      addTransaction: async (tData) => {
        const { data, error } = await supabase
          .from("transactions")
          .insert({
            type: tData.type,
            description: tData.description,
            amount: tData.amount,
            date: tData.date,
            category: tData.category
          })
          .select()
          .single();
        if (error) throw error;

        const newT: Transaction = {
          id: data.id,
          type: data.type,
          description: data.description,
          amount: Number(data.amount),
          date: data.date,
          category: data.category
        };

        set((state) => ({
          transactions: [newT, ...state.transactions]
        }));
        return newT;
      },

      deleteTransaction: async (id) => {
        const { error } = await supabase
          .from("transactions")
          .delete()
          .eq("id", id);
        if (error) throw error;

        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id)
        }));
      },

      updateBudget: async (category, limitAmount) => {
        const { data: existing } = await supabase
          .from("budgets")
          .select("id")
          .eq("category", category)
          .limit(1);

        let error;
        if (existing && existing.length > 0) {
          const { error: err } = await supabase
            .from("budgets")
            .update({ limit_amount: limitAmount })
            .eq("id", existing[0].id);
          error = err;
        } else {
          const { error: err } = await supabase
            .from("budgets")
            .insert({ category, limit_amount: limitAmount });
          error = err;
        }
        if (error) throw error;

        set((state) => {
          const hasBudget = state.budgets.some((b) => b.category === category);
          if (hasBudget) {
            return {
              budgets: state.budgets.map((b) => b.category === category ? { ...b, limitAmount } : b)
            };
          } else {
            return {
              budgets: [
                ...state.budgets,
                { id: Math.random().toString(), category, limitAmount, period: "monthly" }
              ]
            };
          }
        });
      },

      saveSettings: async (updatedSettings) => {
        const currentSettings = get().settings;
        const mergedSettings = { ...currentSettings, ...updatedSettings };

        const { data: existingRows } = await supabase
          .from("settings")
          .select("id")
          .limit(1);

        let error;
        if (existingRows && existingRows.length > 0) {
          const { error: updateError } = await supabase
            .from("settings")
            .update({
              company_name: mergedSettings.companyName,
              company_email: mergedSettings.companyEmail,
              company_phone: mergedSettings.companyPhone,
              company_address: mergedSettings.companyAddress,
              default_vat: mergedSettings.defaultVat,
              invoice_prefix: mergedSettings.invoicePrefix,
              payment_terms: mergedSettings.paymentTerms,
              logo_preview: mergedSettings.logoPreview,
              updated_at: new Date().toISOString()
            })
            .eq("id", existingRows[0].id);
          error = updateError;
        } else {
          const { error: insertError } = await supabase
            .from("settings")
            .insert({
              company_name: mergedSettings.companyName,
              company_email: mergedSettings.companyEmail,
              company_phone: mergedSettings.companyPhone,
              company_address: mergedSettings.companyAddress,
              default_vat: mergedSettings.defaultVat,
              invoice_prefix: mergedSettings.invoicePrefix,
              payment_terms: mergedSettings.paymentTerms,
              logo_preview: mergedSettings.logoPreview
            });
          error = insertError;
        }

        if (error) throw error;

        set({ settings: mergedSettings });
      }
    }),
    {
      name: "app-facture-storage",
      partialize: (state) => ({ theme: state.theme })
    }
  )
);
