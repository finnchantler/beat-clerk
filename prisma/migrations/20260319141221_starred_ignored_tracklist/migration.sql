-- AlterTable
ALTER TABLE "Track" ADD COLUMN     "ignored" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "starred" BOOLEAN NOT NULL DEFAULT false;
