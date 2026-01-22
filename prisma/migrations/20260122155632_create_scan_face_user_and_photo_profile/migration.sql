-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "profilePictureUrl" TEXT;

-- CreateTable
CREATE TABLE "usuarios_scan_face_videos" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_scan_face_videos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "usuarios_scan_face_videos" ADD CONSTRAINT "usuarios_scan_face_videos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
