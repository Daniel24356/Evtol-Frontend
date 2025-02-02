-- CreateTable
CREATE TABLE "BatteryLog" (
    "id" SERIAL NOT NULL,
    "evtolId" INTEGER NOT NULL,
    "level" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BatteryLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BatteryLog" ADD CONSTRAINT "BatteryLog_evtolId_fkey" FOREIGN KEY ("evtolId") REFERENCES "Evtol"("id") ON DELETE CASCADE ON UPDATE CASCADE;
