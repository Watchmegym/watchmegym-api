-- CreateTable
CREATE TABLE "videos_exercicios" (
    "id" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "title" TEXT,
    "description" TEXT,
    "duration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "videos_exercicios_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "videos_exercicios" ADD CONSTRAINT "videos_exercicios_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "exercicios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
