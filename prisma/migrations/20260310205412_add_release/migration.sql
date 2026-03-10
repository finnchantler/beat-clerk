-- CreateEnum
CREATE TYPE "Style" AS ENUM ('TECHNO', 'ELECTRO', 'AMBIENT', 'DOWNTEMPO', 'MINIMAL', 'BREAKBEAT', 'PROGRESSIVE_TRANCE', 'TRANCE', 'ACID', 'HOUSE', 'TECH_HOUSE', 'PROGRESSIVE_HOUSE', 'IDM', 'TRIBAL', 'LEFTFIELD');

-- CreateEnum
CREATE TYPE "Format" AS ENUM ('VINYL', 'MP3', 'FLAC', 'WAV', 'AIFF');

-- CreateTable
CREATE TABLE "Release" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT[],
    "year" INTEGER,
    "format" "Format" NOT NULL,
    "label" TEXT,
    "style" "Style" NOT NULL,
    "country" TEXT,
    "cover" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Release_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Track" (
    "id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "releaseId" TEXT NOT NULL,

    CONSTRAINT "Track_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Release" ADD CONSTRAINT "Release_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_releaseId_fkey" FOREIGN KEY ("releaseId") REFERENCES "Release"("id") ON DELETE CASCADE ON UPDATE CASCADE;
