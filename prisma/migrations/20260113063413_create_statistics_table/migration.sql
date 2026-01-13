-- CreateTable
CREATE TABLE "estatisticas_usuarios_cameras" (
    "id" TEXT NOT NULL,
    "cameraId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "quantityRepetitions" INTEGER NOT NULL,
    "quantitySets" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "estatisticas_usuarios_cameras_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "estatisticas_usuarios_cameras" ADD CONSTRAINT "estatisticas_usuarios_cameras_cameraId_fkey" FOREIGN KEY ("cameraId") REFERENCES "cameras"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estatisticas_usuarios_cameras" ADD CONSTRAINT "estatisticas_usuarios_cameras_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
