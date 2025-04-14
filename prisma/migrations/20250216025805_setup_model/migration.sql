/*
  Warnings:

  - You are about to drop the column `latitude` on the `Evtol` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `Evtol` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Evtol" DROP COLUMN "latitude",
DROP COLUMN "longitude";
