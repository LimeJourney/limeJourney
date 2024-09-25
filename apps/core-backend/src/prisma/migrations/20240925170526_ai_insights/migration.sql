-- CreateTable
CREATE TABLE "AIInsightQuery" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIInsightQuery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AIInsightQuery_organizationId_idx" ON "AIInsightQuery"("organizationId");

-- CreateIndex
CREATE INDEX "AIInsightQuery_createdAt_idx" ON "AIInsightQuery"("createdAt");

-- AddForeignKey
ALTER TABLE "AIInsightQuery" ADD CONSTRAINT "AIInsightQuery_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
