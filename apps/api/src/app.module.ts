import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

/**
 * Module racine de l'API AUTONORME.
 * Les modules métier seront ajoutés ici en Phase 1 :
 * AuthModule, VehiclesModule, GaragesModule, PartsModule,
 * OrdersModule, AutobotModule, WhatsAppModule, MaintenanceModule,
 * NotificationsModule, ReviewsModule, AdminModule
 */
@Module({
  imports: [
    // ── Configuration ───────────────────────────────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),

    // ── Rate Limiting ────────────────────────────────────────────────────────
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 60_000,       // 1 minute
        limit: 100,        // 100 req/min par IP
      },
      {
        name: 'long',
        ttl: 3_600_000,   // 1 heure
        limit: 5_000,
      },
    ]),

    // TODO Phase 1 — Modules métier :
    // AuthModule,
    // UsersModule,
    // VehiclesModule,
    // GaragesModule,
    // AppointmentsModule,
    // PartsModule,
    // OrdersModule,
    // MaintenanceModule,
    // AutobotModule,
    // WhatsAppModule,
    // NotificationsModule,
    // ReviewsModule,
    // InvoicesModule,
    // AdminModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
