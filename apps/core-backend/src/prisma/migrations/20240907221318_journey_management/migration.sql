-- CreateEnum
CREATE TYPE "JourneyStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('JOURNEY_STARTED', 'JOURNEY_COMPLETED', 'JOURNEY_EXITED', 'EMAIL_SENT', 'SMS_SENT', 'PUSH_NOTIFICATION_SENT', 'WAIT_STARTED', 'WAIT_COMPLETED', 'SPLIT_EVALUATED', 'ACTION_PERFORMED');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('SUCCESS', 'FAILURE', 'PENDING');

-- CreateTable
CREATE TABLE "Journey" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "definition" JSONB NOT NULL,
    "status" "JourneyStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Journey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JourneyEvent" (
    "id" TEXT NOT NULL,
    "journeyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nodeId" TEXT NOT NULL,
    "type" "EventType" NOT NULL,
    "status" "EventStatus" NOT NULL,
    "data" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JourneyEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JourneyAnalytics" (
    "id" TEXT NOT NULL,
    "journeyId" TEXT NOT NULL,
    "totalParticipants" INTEGER NOT NULL DEFAULT 0,
    "completionCount" INTEGER NOT NULL DEFAULT 0,
    "averageCompletionTime" DOUBLE PRECISION,
    "stepConversionRates" JSONB,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JourneyAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Journey_organizationId_idx" ON "Journey"("organizationId");

-- CreateIndex
CREATE INDEX "JourneyEvent_journeyId_idx" ON "JourneyEvent"("journeyId");

-- CreateIndex
CREATE INDEX "JourneyEvent_userId_idx" ON "JourneyEvent"("userId");

-- CreateIndex
CREATE INDEX "JourneyEvent_timestamp_idx" ON "JourneyEvent"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "JourneyAnalytics_journeyId_key" ON "JourneyAnalytics"("journeyId");

-- CreateIndex
CREATE INDEX "JourneyAnalytics_journeyId_idx" ON "JourneyAnalytics"("journeyId");

-- AddForeignKey
ALTER TABLE "Journey" ADD CONSTRAINT "Journey_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JourneyEvent" ADD CONSTRAINT "JourneyEvent_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "Journey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JourneyEvent" ADD CONSTRAINT "JourneyEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JourneyAnalytics" ADD CONSTRAINT "JourneyAnalytics_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "Journey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
