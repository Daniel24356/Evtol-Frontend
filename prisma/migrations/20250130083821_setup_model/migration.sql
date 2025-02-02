/*
  Warnings:

  - You are about to drop the column `WeightLimit` on the `Evtol` table. All the data in the column will be lost.
  - Added the required column `weightLimit` to the `Evtol` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Evtol" DROP COLUMN "WeightLimit",
ADD COLUMN     "weightLimit" INTEGER NOT NULL;
