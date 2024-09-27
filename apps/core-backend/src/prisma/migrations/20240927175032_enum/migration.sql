/*
  Warnings:

  - The values [EMAIL_SENT,SMS_SENT,PUSH_NOTIFICATION_SENT] on the enum `EventType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EventType_new" AS ENUM ('JOURNEY_STARTED', 'JOURNEY_COMPLETED', 'JOURNEY_EXITED', 'EMAIL_COMPLETED', 'SMS_COMPLETED', 'PUSH_NOTIFICATION_COMPLETED', 'WAIT_STARTED', 'WAIT_COMPLETED', 'SPLIT_EVALUATED', 'ACTION_PERFORMED', 'ERROR_OCCURRED');
ALTER TABLE "JourneyEvent" ALTER COLUMN "type" TYPE "EventType_new" USING ("type"::text::"EventType_new");
ALTER TYPE "EventType" RENAME TO "EventType_old";
ALTER TYPE "EventType_new" RENAME TO "EventType";
DROP TYPE "EventType_old";
COMMIT;
