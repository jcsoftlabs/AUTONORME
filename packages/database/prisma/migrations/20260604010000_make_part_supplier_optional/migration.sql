-- Allow generic parts without a supplier
ALTER TABLE "parts"
ALTER COLUMN "supplierId" DROP NOT NULL;
