/*
  Warnings:

  - Made the column `description` on table `Segment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Segment" ALTER COLUMN "description" SET NOT NULL;
