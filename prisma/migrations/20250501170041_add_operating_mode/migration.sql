/*
  Warnings:

  - You are about to drop the column `operatingMode` on the `property` table. All the data in the column will be lost.
  - Added the required column `operating_mode` to the `property` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "property" DROP COLUMN "operatingMode",
ADD COLUMN     "operating_mode" "operating_mode" NOT NULL;
