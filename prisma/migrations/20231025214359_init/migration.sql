/*
  Warnings:

  - You are about to drop the column `adress` on the `Supplier` table. All the data in the column will be lost.
  - Added the required column `address` to the `Supplier` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Supplier` DROP COLUMN `adress`,
    ADD COLUMN `address` VARCHAR(191) NOT NULL;
