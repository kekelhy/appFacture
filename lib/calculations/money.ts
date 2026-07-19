/**
 * Formate un montant entier (bigint ou number) en FCFA.
 * Exemple: 250000 -> "250 000 FCFA"
 */
export function formatFCFA(amount: number | bigint): string {
  // Convertir en number si c'est un bigint pour Intl.NumberFormat
  const num = typeof amount === 'bigint' ? Number(amount) : amount;
  
  // Formatage avec séparateur de milliers français (espace insécable)
  const formatted = new Intl.NumberFormat('fr-FR', {
    useGrouping: true,
    maximumFractionDigits: 0,
  }).format(num);
  
  // Remplacer l'espace insécable ou normal par un espace simple standard pour la consistance
  const cleaned = formatted.replace(/\u202f|\u00a0/g, ' ');
  
  return `${cleaned} FCFA`;
}
