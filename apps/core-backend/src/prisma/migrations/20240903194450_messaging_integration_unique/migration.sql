/*
  Warnings:

  - A unique constraint covering the columns `[id,organizationId]` on the table `MessagingProfile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "MessagingProfile_id_organizationId_key" ON "MessagingProfile"("id", "organizationId");
