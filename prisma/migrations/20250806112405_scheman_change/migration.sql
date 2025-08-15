/*
  Warnings:

  - You are about to drop the column `country` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `expireVerifyOtp` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profile` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `verifyOtp` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "country",
DROP COLUMN "expireVerifyOtp",
DROP COLUMN "phoneNumber",
DROP COLUMN "profile",
DROP COLUMN "verifyOtp";

-- CreateTable
CREATE TABLE "public"."AdminProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "designation" TEXT,
    "department" TEXT,
    "permissions" JSONB,

    CONSTRAINT "AdminProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "country" TEXT,
    "profile" TEXT,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminProfile_userId_key" ON "public"."AdminProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "public"."UserProfile"("userId");

-- AddForeignKey
ALTER TABLE "public"."AdminProfile" ADD CONSTRAINT "AdminProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
