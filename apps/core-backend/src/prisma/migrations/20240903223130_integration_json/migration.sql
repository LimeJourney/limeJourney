/*
  Warnings:

  - Added the required column `confidentialFields` to the `MessagingIntegration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MessagingIntegration" ADD COLUMN     "confidentialFields" JSONB NOT NULL;
