/*
  Warnings:

  - You are about to drop the column `medicationId` on the `Evtol` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Evtol" DROP CONSTRAINT "Evtol_medicationId_fkey";

-- AlterTable
ALTER TABLE "Evtol" DROP COLUMN "medicationId";

-- CreateTable
CREATE TABLE "_EvtolMedications" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_EvtolMedications_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_EvtolMedications_B_index" ON "_EvtolMedications"("B");

-- AddForeignKey
ALTER TABLE "_EvtolMedications" ADD CONSTRAINT "_EvtolMedications_A_fkey" FOREIGN KEY ("A") REFERENCES "Evtol"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EvtolMedications" ADD CONSTRAINT "_EvtolMedications_B_fkey" FOREIGN KEY ("B") REFERENCES "Medication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
