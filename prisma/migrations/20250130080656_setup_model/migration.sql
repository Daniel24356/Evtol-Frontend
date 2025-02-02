/*
  Warnings:

  - You are about to drop the column `WeigtLimit` on the `Evtol` table. All the data in the column will be lost.
  - Added the required column `WeightLimit` to the `Evtol` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Evtol" DROP COLUMN "WeigtLimit",
ADD COLUMN     "WeightLimit" INTEGER NOT NULL;
