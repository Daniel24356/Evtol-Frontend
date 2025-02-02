/*
  Warnings:

  - The values [INSTRUCTOR] on the enum `USER_ROLE` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `avatarUrl` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `otp` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `otpExpiry` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profilePicture` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Course` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Enrollment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GoogleUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PasswordHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_instructorEnrollment` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "EVTOL_MODEL" AS ENUM ('LIGHTWEIGHT', 'MIDDLEWEIGHT', 'CRUISERWEIGHT', 'HEAVYWEIGHT');

-- CreateEnum
CREATE TYPE "EVTOL_STATE" AS ENUM ('IDLE', 'LOADING', 'LOADED', 'DELIVERING', 'DELIVERED', 'RETURNING');

-- AlterEnum
BEGIN;
CREATE TYPE "USER_ROLE_new" AS ENUM ('ADMIN', 'USER');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "USER_ROLE_new" USING ("role"::text::"USER_ROLE_new");
ALTER TYPE "USER_ROLE" RENAME TO "USER_ROLE_old";
ALTER TYPE "USER_ROLE_new" RENAME TO "USER_ROLE";
DROP TYPE "USER_ROLE_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'USER';
COMMIT;

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_userId_fkey";

-- DropForeignKey
ALTER TABLE "PasswordHistory" DROP CONSTRAINT "PasswordHistory_userId_fkey";

-- DropForeignKey
ALTER TABLE "_instructorEnrollment" DROP CONSTRAINT "_instructorEnrollment_A_fkey";

-- DropForeignKey
ALTER TABLE "_instructorEnrollment" DROP CONSTRAINT "_instructorEnrollment_B_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "avatarUrl",
DROP COLUMN "emailVerified",
DROP COLUMN "otp",
DROP COLUMN "otpExpiry",
DROP COLUMN "phoneNumber",
DROP COLUMN "profilePicture";

-- DropTable
DROP TABLE "Course";

-- DropTable
DROP TABLE "Enrollment";

-- DropTable
DROP TABLE "GoogleUser";

-- DropTable
DROP TABLE "PasswordHistory";

-- DropTable
DROP TABLE "_instructorEnrollment";

-- DropEnum
DROP TYPE "EnrollmentStatus";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "Evtol" (
    "id" SERIAL NOT NULL,
    "serialNumber" INTEGER NOT NULL,
    "WeigtLimit" INTEGER NOT NULL,
    "batteryCapacity" INTEGER NOT NULL,
    "medicationId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Evtol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medication" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "weight" INTEGER NOT NULL,
    "code" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Medication_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Evtol" ADD CONSTRAINT "Evtol_medicationId_fkey" FOREIGN KEY ("medicationId") REFERENCES "Medication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
