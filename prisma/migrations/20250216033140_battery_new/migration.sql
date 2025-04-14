/*
  Warnings:

  - Made the column `batteryCapacity` on table `Evtol` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Evtol" ALTER COLUMN "batteryCapacity" SET NOT NULL;
