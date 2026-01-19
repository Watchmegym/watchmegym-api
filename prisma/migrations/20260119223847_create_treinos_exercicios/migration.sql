-- CreateTable
CREATE TABLE "treinos" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "treinos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercicios_treinos" (
    "id" TEXT NOT NULL,
    "trainingId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exercicios_treinos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "exercicios_treinos" ADD CONSTRAINT "exercicios_treinos_trainingId_fkey" FOREIGN KEY ("trainingId") REFERENCES "treinos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercicios_treinos" ADD CONSTRAINT "exercicios_treinos_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "exercicios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
