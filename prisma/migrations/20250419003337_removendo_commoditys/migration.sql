/*
  Warnings:

  - You are about to drop the `commodity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `property_commodity` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "property_commodity" DROP CONSTRAINT "property_commodity_commodity_id_fkey";

-- DropForeignKey
ALTER TABLE "property_commodity" DROP CONSTRAINT "property_commodity_property_id_fkey";

-- DropTable
DROP TABLE "commodity";

-- DropTable
DROP TABLE "property_commodity";
