/*
  Warnings:

  - You are about to drop the column `batteryCapacity` on the `Evtol` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Evtol" DROP COLUMN "batteryCapacity",
ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL DEFAULT 0.0;
