/*
  Warnings:

  - You are about to drop the column `guest_count` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the `check_event` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `selectedTime` to the `reservation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "check_event" DROP CONSTRAINT "check_event_reservation_id_fkey";

-- DropForeignKey
ALTER TABLE "photo" DROP CONSTRAINT "photo_property_id_fkey";

-- AlterTable
ALTER TABLE "reservation" DROP COLUMN "guest_count",
ADD COLUMN     "selectedTime" INTEGER NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- DropTable
DROP TABLE "check_event";

-- AddForeignKey
ALTER TABLE "photo" ADD CONSTRAINT "photo_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
