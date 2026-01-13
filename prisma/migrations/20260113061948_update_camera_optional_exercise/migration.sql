-- CreateTable
CREATE TABLE "cameras" (
    "id" TEXT NOT NULL,
    "academyId" TEXT NOT NULL,
    "exerciseId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "streamUrl" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cameras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercicios" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exercicios_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "cameras" ADD CONSTRAINT "cameras_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cameras" ADD CONSTRAINT "cameras_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "exercicios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
