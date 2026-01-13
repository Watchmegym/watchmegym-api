-- CreateTable
CREATE TABLE "academia_usuarios" (
    "id" TEXT NOT NULL,
    "academyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "academia_usuarios_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "academia_usuarios" ADD CONSTRAINT "academia_usuarios_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academia_usuarios" ADD CONSTRAINT "academia_usuarios_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
