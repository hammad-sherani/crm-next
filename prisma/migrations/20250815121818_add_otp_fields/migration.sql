/*
  Warnings:

  - You are about to drop the column `country` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `profile` on the `UserProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "country" TEXT,
ADD COLUMN     "otp" TEXT,
ADD COLUMN     "otpExpiresAt" TIMESTAMP(3),
ADD COLUMN     "profile" TEXT;

-- AlterTable
ALTER TABLE "public"."UserProfile" DROP COLUMN "country",
DROP COLUMN "profile";
