/*
  Warnings:

  - You are about to drop the column `totalParticipants` on the `JourneyAnalytics` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "JourneyAnalytics" DROP COLUMN "totalParticipants",
ADD COLUMN     "runCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalUniqueUsers" INTEGER NOT NULL DEFAULT 0;
