-- CreateTable
CREATE TABLE "LoadedMedication" (
    "id" SERIAL NOT NULL,
    "evtolId" INTEGER NOT NULL,
    "medicationId" INTEGER NOT NULL,
    "loadedByUserId" INTEGER NOT NULL,
    "loadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoadedMedication_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LoadedMedication" ADD CONSTRAINT "LoadedMedication_evtolId_fkey" FOREIGN KEY ("evtolId") REFERENCES "Evtol"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoadedMedication" ADD CONSTRAINT "LoadedMedication_medicationId_fkey" FOREIGN KEY ("medicationId") REFERENCES "Medication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoadedMedication" ADD CONSTRAINT "LoadedMedication_loadedByUserId_fkey" FOREIGN KEY ("loadedByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
