import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // ── Sécurité ──────────────────────────────────────────────────────────────
  app.use(helmet());

  app.enableCors({
    origin: (origin: string | undefined, cb: (err: Error | null, allow: boolean) => void) => {
      const allowed = (process.env['CORS_ORIGINS'] ?? 'http://localhost:3000').split(',');
      if (!origin || allowed.includes(origin) || /\.vercel\.app$/.test(origin)) {
        cb(null, true);
      } else {
        cb(new Error('Not allowed by CORS'), false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept-Language'],
  });

  // ── Versioning API (/api/v1/) ─────────────────────────────────────────────
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // ── Validation globale (class-validator) ──────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // ── Documentation Swagger (/api/docs) ─────────────────────────────────────
  const enableSwagger =
    process.env['ENABLE_SWAGGER'] === 'true' || process.env['NODE_ENV'] !== 'production';

  if (enableSwagger) {
    const config = new DocumentBuilder()
      .setTitle('AUTONORME API')
      .setDescription(
        'API officielle de la plateforme AUTONORME — Secteur automobile haïtien',
      )
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('auth', 'Authentification OTP + JWT')
      .addTag('vehicles', 'Gestion des véhicules')
      .addTag('garages', 'Annuaire et rendez-vous')
      .addTag('parts', 'Catalogue AUTOparts')
      .addTag('orders', 'Commandes et paiements')
      .addTag('autobot', 'Assistant IA AutoBot')
      .addTag('maintenance', 'Plans et rappels de maintenance')
      .addTag('notifications', 'Centre de notifications')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }

  const port = process.env['PORT'] ?? 3001;
  await app.listen(port);

  console.warn(`🚗 AUTONORME API démarrée sur http://localhost:${port}/api/v1`);
  console.warn(`📚 Swagger : http://localhost:${port}/api/docs`);
}

void bootstrap();
