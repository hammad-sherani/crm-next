/*
  Warnings:

  - A unique constraint covering the columns `[phoneNumber]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `country` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `Admin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Admin_phoneNumber_key" ON "Admin"("phoneNumber");
