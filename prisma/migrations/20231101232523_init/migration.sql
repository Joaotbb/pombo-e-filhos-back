-- AlterTable
ALTER TABLE `Order` MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    MODIFY `orderType` VARCHAR(191) NOT NULL DEFAULT 'regular';
