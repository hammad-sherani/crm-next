-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "expireVerifyOtp" TIMESTAMP(3),
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "profile" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "verifyOtp" TEXT;
