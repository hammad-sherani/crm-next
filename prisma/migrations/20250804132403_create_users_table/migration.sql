/*
  Warnings:

  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SuperAdmin` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_createdById_fkey";

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "country" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "status" "public"."ADMIN_STATUS",
ALTER COLUMN "createdById" DROP NOT NULL;

-- DropTable
DROP TABLE "public"."Admin";

-- DropTable
DROP TABLE "public"."SuperAdmin";

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
