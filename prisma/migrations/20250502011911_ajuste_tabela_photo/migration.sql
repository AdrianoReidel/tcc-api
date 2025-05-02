/*
  Warnings:

  - You are about to drop the column `url` on the `photo` table. All the data in the column will be lost.
  - Added the required column `data` to the `photo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "photo" DROP COLUMN "url",
ADD COLUMN     "data" BYTEA NOT NULL;
