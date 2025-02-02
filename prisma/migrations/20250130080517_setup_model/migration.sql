/*
  Warnings:

  - Added the required column `model` to the `Evtol` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Evtol` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Evtol" ADD COLUMN     "model" "EVTOL_MODEL" NOT NULL,
ADD COLUMN     "state" "EVTOL_STATE" NOT NULL;
