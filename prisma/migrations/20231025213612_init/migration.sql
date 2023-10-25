/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `Supplier` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `adress` to the `Supplier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company` to the `Supplier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Supplier` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Supplier` ADD COLUMN `adress` VARCHAR(191) NOT NULL,
    ADD COLUMN `company` VARCHAR(191) NOT NULL,
    ADD COLUMN `phone` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Supplier_phone_key` ON `Supplier`(`phone`);
