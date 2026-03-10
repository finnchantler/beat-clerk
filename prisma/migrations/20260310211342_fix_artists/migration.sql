/*
  Warnings:

  - You are about to drop the column `artist` on the `Release` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Release" DROP COLUMN "artist",
ADD COLUMN     "artists" TEXT[];
