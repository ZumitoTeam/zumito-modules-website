-- CreateTable
CREATE TABLE `Feature` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Feature_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ModuleFeatures` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ModuleFeatures_AB_unique`(`A`, `B`),
    INDEX `_ModuleFeatures_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_ModuleFeatures` ADD CONSTRAINT `_ModuleFeatures_A_fkey` FOREIGN KEY (`A`) REFERENCES `Feature`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ModuleFeatures` ADD CONSTRAINT `_ModuleFeatures_B_fkey` FOREIGN KEY (`B`) REFERENCES `Module`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
