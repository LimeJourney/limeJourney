/*
  Warnings:

  - You are about to drop the column `criteria` on the `Segment` table. All the data in the column will be lost.
  - Added the required column `conditions` to the `Segment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Segment" DROP COLUMN "criteria",
ADD COLUMN     "conditions" JSONB NOT NULL;
