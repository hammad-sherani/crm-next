/*
  Warnings:

  - You are about to drop the column `phoneNumber` on the `UserProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "phoneNumber" TEXT;

-- AlterTable
ALTER TABLE "public"."UserProfile" DROP COLUMN "phoneNumber";
