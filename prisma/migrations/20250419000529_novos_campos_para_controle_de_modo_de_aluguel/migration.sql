/*
  Warnings:

  - The values [HOUSE,APARTMENT,ROOM,OTHER] on the enum `property_type` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `price_per_night` on the `property` table. All the data in the column will be lost.
  - Added the required column `operatingMode` to the `property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price_per_unit` to the `property` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "operating_mode" AS ENUM ('PER_NIGHT', 'PER_HOUR', 'PER_DAY');

-- AlterEnum
BEGIN;
CREATE TYPE "property_type_new" AS ENUM ('HOUSING', 'EVENTS', 'SPORTS');
ALTER TABLE "property" ALTER COLUMN "type" TYPE "property_type_new" USING ("type"::text::"property_type_new");
ALTER TYPE "property_type" RENAME TO "property_type_old";
ALTER TYPE "property_type_new" RENAME TO "property_type";
DROP TYPE "property_type_old";
COMMIT;

-- AlterTable
ALTER TABLE "property" DROP COLUMN "price_per_night",
ADD COLUMN     "operatingMode" "operating_mode" NOT NULL,
ADD COLUMN     "price_per_unit" DECIMAL(10,2) NOT NULL;
