-- AlterTable
ALTER TABLE `Order` MODIFY `status` VARCHAR(191) NULL DEFAULT 'pending',
    MODIFY `orderType` VARCHAR(191) NULL DEFAULT 'regular';
