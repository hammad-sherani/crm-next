-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'USER');

-- AlterTable
ALTER TABLE "SuperAdmin" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'SUPER_ADMIN';
