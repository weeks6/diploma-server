-- AlterTable
ALTER TABLE "File" ALTER COLUMN "public" SET DEFAULT true;

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "guid" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "roomId" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Room" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
