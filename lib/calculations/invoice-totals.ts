export interface InvoiceItemInput {
  quantity: number;
  unitPrice: number;
}

export interface InvoiceTotals {
  subtotal: number;
  vatAmount: number;
  total: number;
}

export const DEFAULT_VAT_RATE = 18; // 18% de TVA standard

/**
 * Calcule les totaux d'une facture à partir de ses lignes d'articles.
 * Chaque ligne est calculée comme quantité * prix unitaire.
 * La TVA est calculée à 18% sur le sous-total et arrondie à l'entier le plus proche.
 */
export function calculateInvoiceTotals(
  items: InvoiceItemInput[],
  vatRatePercent: number = DEFAULT_VAT_RATE
): InvoiceTotals {
  // Calcul du montant de chaque ligne (arrondi individuellement à l'entier pour FCFA)
  const subtotal = items.reduce((acc, item) => {
    const lineAmount = Math.round(item.quantity * item.unitPrice);
    return acc + lineAmount;
  }, 0);

  // Calcul de la TVA globale sur le sous-total arrondi
  const vatAmount = Math.round(subtotal * (vatRatePercent / 100));

  // Total TTC
  const total = subtotal + vatAmount;

  return {
    subtotal,
    vatAmount,
    total,
  };
}
