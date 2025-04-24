-- AlterTable
ALTER TABLE "Availability" ADD COLUMN     "scheduleId" INTEGER;

-- CreateTable
CREATE TABLE "Schedule" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "timeZone" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Schedule_userId_idx" ON "Schedule"("userId");

-- CreateIndex
CREATE INDEX "Availability_scheduleId_idx" ON "Availability"("scheduleId");

-- AddForeignKey
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
