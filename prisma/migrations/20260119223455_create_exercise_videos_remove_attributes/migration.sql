/*
  Warnings:

  - You are about to drop the column `description` on the `videos_exercicios` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `videos_exercicios` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `videos_exercicios` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "videos_exercicios" DROP COLUMN "description",
DROP COLUMN "duration",
DROP COLUMN "title";
