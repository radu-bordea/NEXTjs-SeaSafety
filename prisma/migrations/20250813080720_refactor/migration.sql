/*
  Warnings:

  - You are about to drop the column `userId` on the `Tutorial` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tutorial" DROP CONSTRAINT "Tutorial_userId_fkey";

-- AlterTable
ALTER TABLE "Tutorial" DROP COLUMN "userId";
