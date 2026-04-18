// ─────────────────────────────────────────────────────────────────────────────
// AUTONORME — Design Tokens (Source de vérité du système design)
// Ces valeurs sont la référence absolue pour web ET mobile
// Ne jamais redéfinir ces couleurs dans une app individuelle
// ─────────────────────────────────────────────────────────────────────────────

export const colors = {
  // Couleurs primaires (BLOC 1 — Identité de marque)
  primary: {
    900: '#001F5C',
    800: '#002E7A',
    700: '#003B8E',   // ← Couleur primaire principale
    600: '#0047B0',
    500: '#1565C0',   // ← Couleur secondaire principale
    400: '#4A90D9',
    300: '#7DB8E8',
    200: '#B3D4F0',
    100: '#D6E4F7',   // ← Bleu pâle
    50:  '#EEF5FC',
  },

  // Neutres
  neutral: {
    900: '#0F0F0F',
    800: '#1A1A1A',
    700: '#2D2D2D',
    600: '#4A4A4A',
    500: '#6B6B6B',
    400: '#939393',
    300: '#C2C2C2',
    200: '#E0E0E0',
    100: '#F5F5F5',
    50:  '#FAFAFA',
    0:   '#FFFFFF',
  },

  // Sémantiques
  success: {
    700: '#1B5E20',
    500: '#2E7D32',
    300: '#66BB6A',
    100: '#E8F5E9',
  },
  warning: {
    700: '#E65100',
    500: '#F57C00',
    300: '#FFB74D',
    100: '#FFF3E0',
  },
  error: {
    700: '#B71C1C',
    500: '#C62828',
    300: '#EF5350',
    100: '#FFEBEE',
  },
  info: {
    700: '#01579B',
    500: '#0277BD',
    300: '#4FC3F7',
    100: '#E1F5FE',
  },
} as const;

export const typography = {
  // Polices (BLOC 1)
  fontFamily: {
    heading: "'Poppins', sans-serif",   // Titres
    body:    "'Inter', sans-serif",      // UI, texte courant
  },

  fontWeight: {
    regular:   400,
    medium:    500,
    semibold:  600,
    bold:      700,
    extrabold: 800,
  },

  fontSize: {
    xs:   '0.75rem',    // 12px
    sm:   '0.875rem',   // 14px
    base: '1rem',       // 16px
    lg:   '1.125rem',   // 18px
    xl:   '1.25rem',    // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
  },

  lineHeight: {
    tight:  1.25,
    normal: 1.5,
    loose:  1.75,
  },
} as const;

export const spacing = {
  0:    '0',
  1:    '0.25rem',   // 4px
  2:    '0.5rem',    // 8px
  3:    '0.75rem',   // 12px
  4:    '1rem',      // 16px
  5:    '1.25rem',   // 20px
  6:    '1.5rem',    // 24px
  8:    '2rem',      // 32px
  10:   '2.5rem',    // 40px
  12:   '3rem',      // 48px
  16:   '4rem',      // 64px
  20:   '5rem',      // 80px
  24:   '6rem',      // 96px
} as const;

export const breakpoints = {
  // BLOC 4 — Breakpoints officiels AUTONORME
  sm:  '360px',
  md:  '768px',
  lg:  '1024px',
  xl:  '1280px',
} as const;

export const borderRadius = {
  sm:   '4px',
  md:   '8px',
  lg:   '12px',
  xl:   '16px',
  full: '9999px',
} as const;

export const shadows = {
  sm:  '0 1px 3px rgba(0, 59, 142, 0.1)',
  md:  '0 4px 12px rgba(0, 59, 142, 0.15)',
  lg:  '0 8px 24px rgba(0, 59, 142, 0.2)',
  xl:  '0 16px 48px rgba(0, 59, 142, 0.25)',
} as const;

// Zones tactiles mobile — WCAG 2.1 (BLOC 11 — Accessibilité)
export const touchTarget = {
  minimum: '44px',  // 44×44px minimum
} as const;

// Contrastes — WCAG 2.1 AA (BLOC 11)
export const contrast = {
  normal: 4.5,  // Texte normal
  large:  3.0,  // Texte large
} as const;
