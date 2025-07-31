/*
  Warnings:

  - You are about to drop the column `organizationId` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the `Organization` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_organizationId_fkey";

-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "organizationId";

-- DropTable
DROP TABLE "Organization";
