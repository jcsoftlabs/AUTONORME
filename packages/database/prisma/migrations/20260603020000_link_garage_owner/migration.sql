-- Link garages to their owner user account
ALTER TABLE "garages"
ADD CONSTRAINT "garages_ownerId_fkey"
FOREIGN KEY ("ownerId") REFERENCES "users"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;
