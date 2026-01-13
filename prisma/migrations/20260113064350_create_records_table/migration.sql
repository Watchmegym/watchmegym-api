-- CreateTable
CREATE TABLE "gravacoes" (
    "id" TEXT NOT NULL,
    "cameraId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gravacoes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "gravacoes" ADD CONSTRAINT "gravacoes_cameraId_fkey" FOREIGN KEY ("cameraId") REFERENCES "cameras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gravacoes" ADD CONSTRAINT "gravacoes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
