-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_itemId_fkey";

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
