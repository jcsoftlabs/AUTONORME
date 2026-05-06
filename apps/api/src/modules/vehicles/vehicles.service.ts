import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  Prisma,
  type DrivetrainType,
  type FuelType,
  type OwnershipType,
  type TransmissionType,
  type VehicleBodyType,
  type VehicleUsageType,
} from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import type {
  MaintenanceRecord,
  MaintenanceReminder,
  Vehicle,
  Appointment,
  VehicleRiskFlag,
} from '@prisma/client';
import { ErrorCodes } from '@autonorme/types';

type VehicleSummary = Vehicle & {
  maintenanceRecordsCount: number;
  openRemindersCount: number;
  nextReminder: MaintenanceReminder | null;
};

type VehicleDetails = Vehicle & {
  maintenanceRecordsCount: number;
  openRemindersCount: number;
  records: MaintenanceRecord[];
  reminders: MaintenanceReminder[];
  recentAppointments: Array<
    Pick<Appointment, 'id' | 'datetime' | 'status' | 'notes'> & {
      garage: { name: string; city: string | null };
    }
  >;
  riskFlags: VehicleRiskFlag[];
};

@Injectable()
export class VehiclesService {
  constructor(private readonly db: DatabaseService) {}

  async findAll(userId: string): Promise<VehicleSummary[]> {
    const vehicles = await this.db.vehicle.findMany({
      where: { userId, isActive: true },
      include: {
        reminders: {
          where: { status: { not: 'DONE' } },
          orderBy: { dueDate: 'asc' },
          take: 1,
        },
        _count: {
          select: {
            records: true,
            reminders: {
              where: { status: { not: 'DONE' } },
            },
          },
        },
      },
      orderBy: [{ isPrimaryVehicle: 'desc' }, { updatedAt: 'desc' }],
    });

    return vehicles.map((vehicle) => ({
      ...vehicle,
      nextReminder: vehicle.reminders[0] ?? null,
      openRemindersCount: vehicle._count.reminders,
      maintenanceRecordsCount: vehicle._count.records,
    }));
  }

  async findOne(id: string, userId: string): Promise<VehicleDetails> {
    const vehicle = await this.db.vehicle.findUnique({
      where: { id },
      include: {
        records: {
          orderBy: { date: 'desc' },
          take: 8,
        },
        reminders: {
          where: { status: { not: 'DONE' } },
          orderBy: { dueDate: 'asc' },
          take: 6,
        },
        appointments: {
          orderBy: { datetime: 'desc' },
          take: 6,
          select: {
            id: true,
            datetime: true,
            status: true,
            notes: true,
            garage: {
              select: { name: true, city: true },
            },
          },
        },
        riskFlags: {
          where: { isResolved: false },
          orderBy: { createdAt: 'desc' },
          take: 6,
        },
        _count: {
          select: {
            records: true,
            reminders: {
              where: { status: { not: 'DONE' } },
            },
          },
        },
      },
    });
    if (!vehicle || !vehicle.isActive) {
      throw new NotFoundException({ code: ErrorCodes.VEHICLE_NOT_FOUND, message: 'Véhicule introuvable' });
    }
    if (vehicle.userId !== userId) throw new ForbiddenException();

    return {
      ...vehicle,
      maintenanceRecordsCount: vehicle._count.records,
      openRemindersCount: vehicle._count.reminders,
      recentAppointments: vehicle.appointments,
    };
  }

  async create(userId: string, dto: CreateVehicleDto): Promise<VehicleDetails> {
    const normalized = this.normalizeInput(dto);
    if (!normalized.make || !normalized.model || !normalized.fuelType || normalized.year === undefined) {
      throw new BadRequestException({
        code: ErrorCodes.VEHICLE_VIN_INVALID,
        message: 'Les données du véhicule sont incomplètes',
      });
    }
    const createData: Prisma.VehicleUncheckedCreateInput = {
      userId,
      make: normalized.make,
      model: normalized.model,
      year: normalized.year,
      fuelType: normalized.fuelType,
      isPrimaryVehicle: normalized.isPrimaryVehicle === true || normalized.isPrimaryVehicle === false
        ? normalized.isPrimaryVehicle
        : false,
      trim: normalized.trim,
      bodyType: normalized.bodyType,
      transmission: normalized.transmission,
      engine: normalized.engine,
      drivetrain: normalized.drivetrain,
      vin: normalized.vin,
      mileage: normalized.mileage,
      averageMonthlyMileage: normalized.averageMonthlyMileage,
      color: normalized.color,
      plate: normalized.plate,
      usageType: normalized.usageType,
      primaryCity: normalized.primaryCity,
      primaryZone: normalized.primaryZone,
      purchaseDate: normalized.purchaseDate ? new Date(normalized.purchaseDate) : null,
      purchaseMileage: normalized.purchaseMileage,
      ownershipType: normalized.ownershipType,
      tireSize: normalized.tireSize,
      batterySpec: normalized.batterySpec,
      oilSpec: normalized.oilSpec,
      coolantSpec: normalized.coolantSpec,
      brakeSpec: normalized.brakeSpec,
      locale: normalized.locale,
    };
    const hasVehicles = await this.db.vehicle.count({ where: { userId, isActive: true } });
    const shouldBePrimary = normalized.isPrimaryVehicle === true || hasVehicles === 0;

    try {
      const vehicle = await this.db.$transaction(async (tx) => {
        if (shouldBePrimary) {
          await tx.vehicle.updateMany({
            where: { userId, isActive: true },
            data: { isPrimaryVehicle: false },
          });
        }

        return tx.vehicle.create({
          data: {
            ...createData,
            isPrimaryVehicle: shouldBePrimary,
          },
        });
      });

      return this.findOne(vehicle.id, userId);
    } catch (error) {
      this.handleVehicleWriteError(error);
    }
  }

  async update(id: string, userId: string, dto: UpdateVehicleDto): Promise<VehicleDetails> {
    await this.findOne(id, userId);
    const normalized = this.normalizeInput(dto);
    const shouldBePrimary = normalized.isPrimaryVehicle === true;

    try {
      await this.db.$transaction(async (tx) => {
        if (shouldBePrimary) {
          await tx.vehicle.updateMany({
            where: { userId, isActive: true, NOT: { id } },
            data: { isPrimaryVehicle: false },
          });
        }

        await tx.vehicle.update({
          where: { id },
          data: {
            ...normalized,
            purchaseDate:
              normalized.purchaseDate !== undefined
                ? normalized.purchaseDate
                  ? new Date(normalized.purchaseDate)
                  : null
                : undefined,
          },
        });
      });

      return this.findOne(id, userId);
    } catch (error) {
      this.handleVehicleWriteError(error);
    }
  }

  async remove(id: string, userId: string): Promise<void> {
    const vehicle = await this.findOne(id, userId);

    await this.db.$transaction(async (tx) => {
      await tx.vehicle.update({ where: { id }, data: { isActive: false, archivedAt: new Date() } });

      if (vehicle.isPrimaryVehicle) {
        const replacement = await tx.vehicle.findFirst({
          where: { userId, isActive: true, NOT: { id } },
          orderBy: { updatedAt: 'desc' },
        });

        if (replacement) {
          await tx.vehicle.update({
            where: { id: replacement.id },
            data: { isPrimaryVehicle: true },
          });
        }
      }
    });
  }

  private normalizeInput(dto: Partial<CreateVehicleDto>): {
    make?: string;
    model?: string;
    year?: number;
    trim?: string | null;
    bodyType?: VehicleBodyType;
    fuelType?: FuelType;
    transmission?: TransmissionType;
    engine?: string | null;
    drivetrain?: DrivetrainType;
    vin?: string | null;
    mileage?: number;
    averageMonthlyMileage?: number;
    color?: string | null;
    plate?: string | null;
    usageType?: VehicleUsageType;
    primaryCity?: string | null;
    primaryZone?: string | null;
    isPrimaryVehicle?: boolean;
    purchaseDate?: string;
    purchaseMileage?: number;
    ownershipType?: OwnershipType;
    tireSize?: string | null;
    batterySpec?: string | null;
    oilSpec?: string | null;
    coolantSpec?: string | null;
    brakeSpec?: string | null;
    locale?: string | null;
  } {
    return {
      ...dto,
      make: dto.make?.trim(),
      model: dto.model?.trim(),
      year: dto.year,
      trim: this.nullableString(dto.trim),
      bodyType: dto.bodyType as VehicleBodyType | undefined,
      fuelType: dto.fuelType as FuelType | undefined,
      transmission: dto.transmission as TransmissionType | undefined,
      engine: this.nullableString(dto.engine),
      drivetrain: dto.drivetrain as DrivetrainType | undefined,
      vin: dto.vin ? dto.vin.trim().toUpperCase() : dto.vin === '' ? null : dto.vin,
      color: this.nullableString(dto.color),
      plate: this.nullableString(dto.plate),
      usageType: dto.usageType as VehicleUsageType | undefined,
      primaryCity: this.nullableString(dto.primaryCity),
      primaryZone: this.nullableString(dto.primaryZone),
      ownershipType: dto.ownershipType as OwnershipType | undefined,
      tireSize: this.nullableString(dto.tireSize),
      batterySpec: this.nullableString(dto.batterySpec),
      oilSpec: this.nullableString(dto.oilSpec),
      coolantSpec: this.nullableString(dto.coolantSpec),
      brakeSpec: this.nullableString(dto.brakeSpec),
      locale: this.nullableString(dto.locale),
      purchaseDate: dto.purchaseDate ?? undefined,
    };
  }

  private nullableString(value?: string | null) {
    if (value === undefined) return undefined;
    const trimmed = value?.trim();
    return trimmed ? trimmed : null;
  }

  private handleVehicleWriteError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new ConflictException({
        code: ErrorCodes.VEHICLE_ALREADY_EXISTS,
        message: 'Un véhicule avec ce VIN existe déjà',
      });
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new BadRequestException({
        code: ErrorCodes.VEHICLE_VIN_INVALID,
        message: 'Les données du véhicule sont invalides',
      });
    }

    throw error;
  }

  async scanInsuranceCard(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey || apiKey === 'CHANGE_ME') {
      // Fallback simulation si pas de clé
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return {
        success: true,
        data: { make: 'TOYOTA', model: 'HILUX', year: 2019, vin: 'AHTFR12G900SIMUL', plate: 'AA-12345' },
        message: 'Simulation (Clé API manquante)',
      };
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `
        Analyse cette photo de carte d'assurance automobile (OAVCT ou autre).
        Extraits les informations suivantes sous forme d'un objet JSON pur, sans markdown :
        {
          "make": "LA MARQUE",
          "model": "LE MODELE",
          "year": 2024,
          "vin": "NUMERO DE CHASSIS",
          "plate": "PLAQUE",
          "fuelType": "essence ou diesel",
          "color": "couleur"
        }
        Si une info est illisible, mets null.
      `;

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: file.buffer.toString('base64'),
            mimeType: file.mimetype,
          },
        },
      ]);

      const responseText = result.response.text();
      // Nettoyage de la réponse pour ne garder que le JSON
      const jsonStr = responseText.replace(/```json|```/g, '').trim();
      const extractedData = JSON.parse(jsonStr);

      return {
        success: true,
        data: extractedData,
        message: 'Carte analysée avec succès par Gemini AI',
      };
    } catch (error) {
      console.error('Gemini Scan Error:', error);
      throw new BadRequestException('Erreur lors de l\'analyse de l\'image par l\'IA');
    }
  }
}
