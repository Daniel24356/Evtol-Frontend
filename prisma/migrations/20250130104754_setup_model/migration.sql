/*
  Warnings:

  - A unique constraint covering the columns `[serialNumber]` on the table `Evtol` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Evtol_serialNumber_key" ON "Evtol"("serialNumber");
