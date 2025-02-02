/*
  Warnings:

  - You are about to drop the column `userId` on the `Course` table. All the data in the column will be lost.
  - Added the required column `instructorId` to the `Enrollment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_userId_fkey";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Enrollment" ADD COLUMN     "instructorId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "_instructorEnrollment" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_instructorEnrollment_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_instructorEnrollment_B_index" ON "_instructorEnrollment"("B");

-- AddForeignKey
ALTER TABLE "_instructorEnrollment" ADD CONSTRAINT "_instructorEnrollment_A_fkey" FOREIGN KEY ("A") REFERENCES "Enrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_instructorEnrollment" ADD CONSTRAINT "_instructorEnrollment_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
