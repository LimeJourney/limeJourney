/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `JourneyAnalytics` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `JourneyEvent` table. All the data in the column will be lost.
  - Added the required column `lastUpdated` to the `JourneyAnalytics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entityId` to the `JourneyEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "EventStatus" ADD VALUE 'ERROR';

-- AlterEnum
ALTER TYPE "EventType" ADD VALUE 'ERROR_OCCURRED';

-- DropForeignKey
ALTER TABLE "JourneyEvent" DROP CONSTRAINT "JourneyEvent_userId_fkey";

-- DropIndex
DROP INDEX "JourneyEvent_userId_idx";

-- AlterTable
ALTER TABLE "JourneyAnalytics" DROP COLUMN "updatedAt",
ADD COLUMN     "errorCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastUpdated" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "JourneyEvent" DROP COLUMN "userId",
ADD COLUMN     "entityId" TEXT NOT NULL,
ADD COLUMN     "error" TEXT;

-- CreateIndex
CREATE INDEX "JourneyEvent_entityId_idx" ON "JourneyEvent"("entityId");
