-- This is an empty migration.
-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT IF EXISTS "Item_roomId_fkey";

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;
