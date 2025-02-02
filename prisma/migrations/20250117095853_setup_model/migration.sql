/*
  Warnings:

  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "otp" TEXT,
ADD COLUMN     "otpExpiry" TEXT,
ALTER COLUMN "password" DROP NOT NULL;

-- DropTable
DROP TABLE "Product";

-- DropEnum
DROP TYPE "ROLE";
