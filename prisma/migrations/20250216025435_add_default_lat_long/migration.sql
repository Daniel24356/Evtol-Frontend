/*
  Warnings:

  - Made the column `latitude` on table `Evtol` required. This step will fail if there are existing NULL values in that column.
  - Made the column `longitude` on table `Evtol` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
UPDATE "Evtol" SET latitude = 0.0 WHERE latitude IS NULL;
UPDATE "Evtol" SET longitude = 0.0 WHERE longitude IS NULL;
