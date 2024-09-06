-- CreateTable
CREATE TABLE "MessagingIntegration" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "providerName" TEXT NOT NULL,
    "requiredFields" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MessagingIntegration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessagingProfile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "integrationId" TEXT NOT NULL,
    "credentials" JSONB NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MessagingProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MessagingProfile_organizationId_idx" ON "MessagingProfile"("organizationId");

-- CreateIndex
CREATE INDEX "MessagingProfile_integrationId_idx" ON "MessagingProfile"("integrationId");

-- AddForeignKey
ALTER TABLE "MessagingProfile" ADD CONSTRAINT "MessagingProfile_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessagingProfile" ADD CONSTRAINT "MessagingProfile_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "MessagingIntegration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
