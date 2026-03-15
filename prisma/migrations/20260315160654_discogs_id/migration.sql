/*
  Warnings:

  - A unique constraint covering the columns `[discogsId]` on the table `Release` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Release" ADD COLUMN     "discogsId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Release_discogsId_key" ON "Release"("discogsId");
