-- AlterTable
CREATE SEQUENCE "movementhistory_id_seq";
ALTER TABLE "MovementHistory" ALTER COLUMN "id" SET DEFAULT nextval('movementhistory_id_seq');
ALTER SEQUENCE "movementhistory_id_seq" OWNED BY "MovementHistory"."id";
