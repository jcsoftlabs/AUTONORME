-- CreateEnum
CREATE TYPE "FuelType" AS ENUM ('essence', 'diesel', 'hybride', 'electrique');

-- CreateEnum
CREATE TYPE "VehicleBodyType" AS ENUM ('SUV', 'SEDAN', 'HATCHBACK', 'PICKUP', 'VAN', 'MOTO', 'TRICYCLE', 'AUTRE');

-- CreateEnum
CREATE TYPE "TransmissionType" AS ENUM ('MANUELLE', 'AUTOMATIQUE', 'CVT', 'AUTRE');

-- CreateEnum
CREATE TYPE "DrivetrainType" AS ENUM ('FWD', 'RWD', 'AWD', 'FOUR_X_FOUR');

-- CreateEnum
CREATE TYPE "VehicleUsageType" AS ENUM ('PERSONNEL', 'COMMERCIAL', 'MIXTE');

-- CreateEnum
CREATE TYPE "VehicleStatus" AS ENUM ('ACTIVE', 'IMMOBILIZED', 'SOLD', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "OwnershipType" AS ENUM ('OWNER', 'FLEET', 'LEASE');

-- CreateEnum
CREATE TYPE "VehicleSource" AS ENUM ('MANUAL', 'ONBOARDING', 'AUTOBOT', 'WHATSAPP', 'IMPORT');

-- CreateEnum
CREATE TYPE "ReminderPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "ServiceStatus" AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "InspectionType" AS ENUM ('GENERAL', 'PRE_PURCHASE', 'BRAKES', 'ENGINE', 'SUSPENSION', 'ELECTRICAL');

-- CreateEnum
CREATE TYPE "InspectionResult" AS ENUM ('OK', 'WARNING', 'CRITICAL');

-- CreateEnum
CREATE TYPE "IncidentType" AS ENUM ('ACCIDENT', 'BREAKDOWN', 'OVERHEAT', 'BATTERY', 'TIRE', 'OTHER');

-- CreateEnum
CREATE TYPE "IncidentSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "VehicleDocumentType" AS ENUM ('REGISTRATION', 'INSURANCE', 'INVOICE', 'INSPECTION_REPORT', 'MAINTENANCE_PROOF', 'PHOTO', 'OTHER');

-- CreateEnum
CREATE TYPE "VehicleRiskFlagType" AS ENUM ('MILEAGE_INCONSISTENCY', 'MISSING_HISTORY', 'OVERDUE_MAINTENANCE', 'LOW_DATA_CONFIDENCE', 'REPEATED_BREAKDOWN');

-- AlterTable
ALTER TABLE "vehicles"
ADD COLUMN     "trim" TEXT,
ADD COLUMN     "bodyType" "VehicleBodyType",
ADD COLUMN     "transmission" "TransmissionType",
ADD COLUMN     "engine" TEXT,
ADD COLUMN     "drivetrain" "DrivetrainType",
ADD COLUMN     "averageMonthlyMileage" INTEGER,
ADD COLUMN     "usageType" "VehicleUsageType",
ADD COLUMN     "primaryCity" TEXT,
ADD COLUMN     "primaryZone" TEXT,
ADD COLUMN     "isPrimaryVehicle" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" "VehicleStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "purchaseDate" TIMESTAMP(3),
ADD COLUMN     "purchaseMileage" INTEGER,
ADD COLUMN     "ownershipType" "OwnershipType" NOT NULL DEFAULT 'OWNER',
ADD COLUMN     "source" "VehicleSource" NOT NULL DEFAULT 'MANUAL',
ADD COLUMN     "tireSize" TEXT,
ADD COLUMN     "batterySpec" TEXT,
ADD COLUMN     "oilSpec" TEXT,
ADD COLUMN     "coolantSpec" TEXT,
ADD COLUMN     "brakeSpec" TEXT,
ADD COLUMN     "vehicleScore" INTEGER,
ADD COLUMN     "vehicleScoreUpdatedAt" TIMESTAMP(3),
ADD COLUMN     "historyCompleteness" INTEGER,
ADD COLUMN     "maintenanceDiscipline" INTEGER,
ADD COLUMN     "dataConfidenceScore" INTEGER,
ADD COLUMN     "locale" TEXT DEFAULT 'fr',
ADD COLUMN     "lastActivityAt" TIMESTAMP(3),
ADD COLUMN     "archivedAt" TIMESTAMP(3),
ADD COLUMN     "fuelType_v2" "FuelType";

-- MigrateData
UPDATE "vehicles"
SET "fuelType_v2" = CASE LOWER("fuelType")
  WHEN 'essence' THEN 'essence'::"FuelType"
  WHEN 'diesel' THEN 'diesel'::"FuelType"
  WHEN 'hybride' THEN 'hybride'::"FuelType"
  WHEN 'electrique' THEN 'electrique'::"FuelType"
  ELSE 'essence'::"FuelType"
END;

-- AlterTable
ALTER TABLE "vehicles" DROP COLUMN "fuelType";
ALTER TABLE "vehicles" RENAME COLUMN "fuelType_v2" TO "fuelType";
ALTER TABLE "vehicles" ALTER COLUMN "fuelType" SET NOT NULL;

-- AlterTable
ALTER TABLE "maintenance_records"
ADD COLUMN     "status" "ServiceStatus" NOT NULL DEFAULT 'COMPLETED',
ADD COLUMN     "nextDueDate" TIMESTAMP(3),
ADD COLUMN     "nextDueMileage" INTEGER,
ADD COLUMN     "garageId" TEXT,
ADD COLUMN     "totalCostHtg" DECIMAL(10,2),
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- MigrateData
UPDATE "maintenance_records"
SET "updatedAt" = "createdAt"
WHERE "updatedAt" IS NULL;

-- AlterTable
ALTER TABLE "maintenance_records"
ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "maintenance_reminders"
ADD COLUMN     "dueMileage" INTEGER,
ADD COLUMN     "priority" "ReminderPriority" NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN     "confirmedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- MigrateData
UPDATE "maintenance_reminders"
SET "updatedAt" = "createdAt"
WHERE "updatedAt" IS NULL;

-- AlterTable
ALTER TABLE "maintenance_reminders"
ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "orders"
ADD COLUMN     "vehicleId" TEXT;

-- DropIndex
DROP INDEX "vehicles_userId_idx";

-- DropIndex
DROP INDEX "maintenance_records_vehicleId_idx";

-- CreateTable
CREATE TABLE "parts_installations" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "maintenanceRecordId" TEXT,
    "partId" TEXT,
    "nameSnapshot" TEXT NOT NULL,
    "oemReference" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitPriceHtg" DECIMAL(10,2),
    "installedAt" TIMESTAMP(3) NOT NULL,
    "mileageAt" INTEGER,
    "notes" TEXT,

    CONSTRAINT "parts_installations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle_inspections" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "inspectionType" "InspectionType" NOT NULL,
    "inspectionDate" TIMESTAMP(3) NOT NULL,
    "mileageAt" INTEGER,
    "summary" TEXT,
    "result" "InspectionResult" NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vehicle_inspections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle_incidents" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "incidentType" "IncidentType" NOT NULL,
    "incidentDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "severity" "IncidentSeverity",
    "estimatedCostHtg" DECIMAL(10,2),
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vehicle_incidents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle_documents" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "maintenanceRecordId" TEXT,
    "type" "VehicleDocumentType" NOT NULL,
    "title" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "mimeType" TEXT,
    "issuedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vehicle_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle_risk_flags" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "type" "VehicleRiskFlagType" NOT NULL,
    "severity" "IncidentSeverity" NOT NULL DEFAULT 'MEDIUM',
    "message" TEXT NOT NULL,
    "isResolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vehicle_risk_flags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_vin_key" ON "vehicles"("vin");

-- CreateIndex
CREATE INDEX "vehicles_userId_isActive_idx" ON "vehicles"("userId", "isActive");

-- CreateIndex
CREATE INDEX "vehicles_vin_idx" ON "vehicles"("vin");

-- CreateIndex
CREATE INDEX "vehicles_plate_idx" ON "vehicles"("plate");

-- CreateIndex
CREATE INDEX "vehicles_make_model_year_idx" ON "vehicles"("make", "model", "year");

-- CreateIndex
CREATE INDEX "maintenance_records_vehicleId_date_idx" ON "maintenance_records"("vehicleId", "date");

-- CreateIndex
CREATE INDEX "orders_vehicleId_idx" ON "orders"("vehicleId");

-- CreateIndex
CREATE INDEX "parts_installations_vehicleId_installedAt_idx" ON "parts_installations"("vehicleId", "installedAt");

-- CreateIndex
CREATE INDEX "vehicle_inspections_vehicleId_inspectionDate_idx" ON "vehicle_inspections"("vehicleId", "inspectionDate");

-- CreateIndex
CREATE INDEX "vehicle_incidents_vehicleId_incidentDate_idx" ON "vehicle_incidents"("vehicleId", "incidentDate");

-- CreateIndex
CREATE INDEX "vehicle_documents_vehicleId_type_idx" ON "vehicle_documents"("vehicleId", "type");

-- CreateIndex
CREATE INDEX "vehicle_risk_flags_vehicleId_isResolved_idx" ON "vehicle_risk_flags"("vehicleId", "isResolved");

-- AddForeignKey
ALTER TABLE "maintenance_records" ADD CONSTRAINT "maintenance_records_garageId_fkey" FOREIGN KEY ("garageId") REFERENCES "garages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parts_installations" ADD CONSTRAINT "parts_installations_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parts_installations" ADD CONSTRAINT "parts_installations_maintenanceRecordId_fkey" FOREIGN KEY ("maintenanceRecordId") REFERENCES "maintenance_records"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parts_installations" ADD CONSTRAINT "parts_installations_partId_fkey" FOREIGN KEY ("partId") REFERENCES "parts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_inspections" ADD CONSTRAINT "vehicle_inspections_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_incidents" ADD CONSTRAINT "vehicle_incidents_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_documents" ADD CONSTRAINT "vehicle_documents_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_documents" ADD CONSTRAINT "vehicle_documents_maintenanceRecordId_fkey" FOREIGN KEY ("maintenanceRecordId") REFERENCES "maintenance_records"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_risk_flags" ADD CONSTRAINT "vehicle_risk_flags_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
