/*
  Warnings:

  - You are about to drop the column `instructorId` on the `Course` table. All the data in the column will be lost.
  - Added the required column `duration` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_instructorId_fkey";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "instructorId",
ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
