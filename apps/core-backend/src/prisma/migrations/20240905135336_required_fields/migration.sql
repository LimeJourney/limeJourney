-- AlterTable
ALTER TABLE "MessagingProfile" ADD COLUMN     "requiredFields" JSONB NOT NULL DEFAULT '{}';
