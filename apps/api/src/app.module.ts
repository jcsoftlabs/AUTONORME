import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

// Infrastructure
import { DatabaseModule } from './modules/database/database.module';

// Shared
import { JwtAuthGuard } from './shared/guards/jwt-auth.guard';
import { RolesGuard } from './shared/guards/roles.guard';
import { GlobalExceptionFilter } from './shared/filters/global-exception.filter';
import { TransformInterceptor } from './shared/interceptors/transform.interceptor';

// Modules métier — Phase 1
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { GaragesModule } from './modules/garages/garages.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { PartsModule } from './modules/parts/parts.module';
import { AutobotModule } from './modules/autobot/autobot.module';

@Module({
  imports: [
    // ── Configuration globale ────────────────────────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),

    // ── Rate Limiting : 100 req/min par IP ──────────────────────────────────
    ThrottlerModule.forRoot([
      { name: 'short', ttl: 60_000, limit: 100 },
      { name: 'long',  ttl: 3_600_000, limit: 5_000 },
    ]),

    // ── Base de données (global) ─────────────────────────────────────────────
    DatabaseModule,

    // ── Modules métier ───────────────────────────────────────────────────────
    AuthModule,
    UsersModule,
    VehiclesModule,
    GaragesModule,
    AppointmentsModule,
    PartsModule,
    AutobotModule,
  ],
  providers: [
    // Guards globaux (appliqués sur toutes les routes)
    { provide: APP_GUARD,       useClass: JwtAuthGuard },
    { provide: APP_GUARD,       useClass: RolesGuard },
    // Filtre d'exception global → format AUTONORME_*
    { provide: APP_FILTER,      useClass: GlobalExceptionFilter },
    // Transforme toutes les réponses en { success: true, data }
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
  ],
})
export class AppModule {}
