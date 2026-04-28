-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `aktif` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Produk` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kode` VARCHAR(191) NOT NULL,
    `barcode` VARCHAR(191) NULL,
    `nama` VARCHAR(191) NOT NULL,
    `harga` DOUBLE NOT NULL,
    `stok` INTEGER NOT NULL,

    UNIQUE INDEX `Produk_kode_key`(`kode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transaksi` (
    `id` VARCHAR(191) NOT NULL,
    `nomor_nota` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `total` DOUBLE NOT NULL,
    `bayar` DOUBLE NOT NULL,
    `kembalian` DOUBLE NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DetailTransaksi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `transaksi_id` VARCHAR(191) NOT NULL,
    `produk_id` INTEGER NOT NULL,
    `nama_produk` VARCHAR(191) NOT NULL,
    `harga_satuan` DOUBLE NOT NULL,
    `qty` INTEGER NOT NULL,
    `subtotal` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Transaksi` ADD CONSTRAINT `Transaksi_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetailTransaksi` ADD CONSTRAINT `DetailTransaksi_transaksi_id_fkey` FOREIGN KEY (`transaksi_id`) REFERENCES `Transaksi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
