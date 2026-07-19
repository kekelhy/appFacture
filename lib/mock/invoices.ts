export interface MockInvoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  issueDate: string; // Format YYYY-MM-DD
  dueDate: string;   // Format YYYY-MM-DD
  amount: number;    // TTC en FCFA
  status: 'draft' | 'sent' | 'paid';
}

export const MOCK_INVOICES: MockInvoice[] = [
  {
    id: '1',
    invoiceNumber: 'FAC-2026-0001',
    clientName: 'Cansaas Agency',
    clientEmail: 'contact@cansaas.com',
    issueDate: '2026-06-15',
    dueDate: '2026-07-15',
    amount: 1500000,
    status: 'paid',
  },
  {
    id: '2',
    invoiceNumber: 'FAC-2026-0002',
    clientName: 'Sénégal Tech Solutions',
    clientEmail: 'info@sentech.sn',
    issueDate: '2026-07-01',
    dueDate: '2026-08-01',
    amount: 450000,
    status: 'sent',
  },
  {
    id: '3',
    invoiceNumber: 'FAC-2026-0003',
    clientName: 'Amina Diallo Consulting',
    clientEmail: 'amina@diallo.com',
    issueDate: '2026-05-10',
    dueDate: '2026-06-10',
    amount: 750000,
    status: 'sent', // Échéance dépassée par rapport au 12/07/2026 => Overdue
  },
  {
    id: '4',
    invoiceNumber: 'FAC-2026-0004',
    clientName: 'Koffi & Frères',
    clientEmail: 'koffi@freres.ci',
    issueDate: '2026-07-10',
    dueDate: '2026-08-10',
    amount: 250000,
    status: 'draft',
  },
  {
    id: '5',
    invoiceNumber: 'FAC-2026-0005',
    clientName: 'Binta Diop SARL',
    clientEmail: 'binta@diopsarl.com',
    issueDate: '2026-06-20',
    dueDate: '2026-07-20',
    amount: 1200000,
    status: 'paid',
  }
];

export const MOCK_REVENUE_DATA = [
  { month: 'Janvier', facturé: 1200000, payé: 1200000 },
  { month: 'Février', facturé: 1800000, payé: 1500000 },
  { month: 'Mars', facturé: 2200000, payé: 2200000 },
  { month: 'Avril', facturé: 1500000, payé: 1500000 },
  { month: 'Mai', facturé: 3000000, payé: 2250000 },
  { month: 'Juin', facturé: 4150000, payé: 2700000 },
];
