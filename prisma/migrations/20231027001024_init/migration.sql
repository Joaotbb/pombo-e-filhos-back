/*
  Warnings:

  - A unique constraint covering the columns `[serialNumber]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Product` ADD COLUMN `serialNumber` VARCHAR(191) NOT NULL DEFAULT 'TEMP';

-- CreateIndex
CREATE UNIQUE INDEX `Product_serialNumber_key` ON `Product`(`serialNumber`);
