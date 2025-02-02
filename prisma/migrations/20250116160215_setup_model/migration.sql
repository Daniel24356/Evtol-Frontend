-- CreateEnum
CREATE TYPE "ROLE" AS ENUM ('ADMIN', 'USER', 'VENDORS');

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "productName" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "rating" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoogleUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "googleId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatarUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GoogleUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GoogleUser_email_key" ON "GoogleUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "GoogleUser_googleId_key" ON "GoogleUser"("googleId");
