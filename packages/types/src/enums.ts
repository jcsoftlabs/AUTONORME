// ─────────────────────────────────────────────────────────────────────────────
// AUTONORME — Enums partagés (source de vérité unique)
// Miroir des enums Prisma — doit rester synchronisé avec schema.prisma
// ─────────────────────────────────────────────────────────────────────────────

export enum Role {
  CLIENT = 'CLIENT',
  GARAGE = 'GARAGE',
  SUPPLIER = 'SUPPLIER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum ReminderStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  CONFIRMED = 'CONFIRMED',
  SNOOZED = 'SNOOZED',
  DONE = 'DONE',
}

export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export enum PartCategory {
  FREINAGE = 'FREINAGE',
  MOTEUR = 'MOTEUR',
  SUSPENSION = 'SUSPENSION',
  ELECTRIQUE = 'ELECTRIQUE',
  CARROSSERIE = 'CARROSSERIE',
  AUTRE = 'AUTRE',
}

export enum OrderStatus {
  CONFIRMED = 'CONFIRMED',
  PREPARED = 'PREPARED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentMethod {
  MONCASH = 'MONCASH',
  STRIPE = 'STRIPE',
  VIREMENT = 'VIREMENT',
  AUTOFIN = 'AUTOFIN',
}

export enum DeliveryType {
  GARAGE_PICKUP = 'GARAGE_PICKUP',
  HOME_DELIVERY = 'HOME_DELIVERY',
}

export enum ConversationChannel {
  WEB = 'WEB',
  MOBILE = 'MOBILE',
  WHATSAPP = 'WHATSAPP',
}

export enum Locale {
  FR = 'fr',
  HT = 'ht',
  EN = 'en',
}
