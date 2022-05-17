/*
  Warnings:

  - You are about to drop the column `imageId` on the `Item` table. All the data in the column will be lost.
  - Added the required column `itemId` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_imageId_fkey";

-- DropIndex
DROP INDEX "Item_imageId_key";

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "itemId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "imageId";

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
