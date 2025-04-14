-- CreateTable
CREATE TABLE "Delivery" (
    "id" TEXT NOT NULL,
    "evtolId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Delivery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Delivery_evtolId_key" ON "Delivery"("evtolId");

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_evtolId_fkey" FOREIGN KEY ("evtolId") REFERENCES "Evtol"("serialNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
