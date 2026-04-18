// ─────────────────────────────────────────────────────────────────────────────
// AUTONORME — Utilitaires de formatage localisés
// Source de vérité unique — utiliser ces fonctions partout (web, mobile, api)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Formate un montant en Gourde haïtienne (HTG)
 * Format officiel AUTONORME : "G 3 500" ou "3 500 HTG"
 * @param amount - Montant numérique
 * @param style - 'symbol' (G 3 500) | 'code' (3 500 HTG)
 */
export function formatHTG(amount: number, style: 'symbol' | 'code' = 'symbol'): string {
  const formatted = new Intl.NumberFormat('fr-HT', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);

  return style === 'symbol' ? `G ${formatted}` : `${formatted} HTG`;
}

/**
 * Formate un montant en USD (pour pièces importées)
 * Affiche toujours le taux de change HTG en parallèle
 * @param amountUsd - Montant en USD
 * @param exchangeRate - Taux de change HTG/USD du jour
 */
export function formatUSD(amountUsd: number, exchangeRate?: number): string {
  const usdFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amountUsd);

  if (exchangeRate) {
    const htgEquivalent = formatHTG(amountUsd * exchangeRate);
    return `${usdFormatted} (≈ ${htgEquivalent})`;
  }

  return usdFormatted;
}

/**
 * Formate une date au format haïtien JJ/MM/AAAA
 * Fuseau horaire : America/Port-au-Prince
 * @param date - Date à formater
 */
export function formatHaitianDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('fr-HT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'America/Port-au-Prince',
  }).format(d);
}

/**
 * Formate une date avec heure au format haïtien
 * @param date - Date à formater
 */
export function formatHaitianDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('fr-HT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Port-au-Prince',
  }).format(d);
}

/**
 * Formate un numéro de téléphone haïtien au format +509 XXXX XXXX
 * @param phone - Numéro brut (avec ou sans préfixe)
 */
export function formatHaitianPhone(phone: string): string {
  // Supprimer tous les caractères non numériques
  const digits = phone.replace(/\D/g, '');

  // Cas : numéro avec indicatif pays 509
  if (digits.startsWith('509') && digits.length === 11) {
    return `+509 ${digits.slice(3, 7)} ${digits.slice(7)}`;
  }

  // Cas : numéro local 8 chiffres
  if (digits.length === 8) {
    return `+509 ${digits.slice(0, 4)} ${digits.slice(4)}`;
  }

  // Retourner tel quel si format non reconnu
  return phone;
}

/**
 * Valide un numéro de téléphone haïtien
 * Format accepté : +509 XXXX XXXX ou 509XXXXXXXX ou 8 chiffres locaux
 */
export function isValidHaitianPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return (
    (digits.startsWith('509') && digits.length === 11) || digits.length === 8
  );
}

/**
 * Valide un numéro VIN (17 caractères alphanumérique)
 */
export function isValidVIN(vin: string): boolean {
  const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/i;
  return vinRegex.test(vin.trim());
}
