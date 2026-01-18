-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "cpfCnpj" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "asaasCustomerId" TEXT;

-- CreateTable
CREATE TABLE "planos" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "billingType" TEXT NOT NULL DEFAULT 'CREDIT_CARD',
    "cycle" TEXT NOT NULL DEFAULT 'MONTHLY',
    "features" JSONB,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "planos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assinaturas" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "asaasSubscriptionId" TEXT,
    "asaasCustomerId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "nextDueDate" TIMESTAMP(3),
    "paymentMethod" TEXT,
    "autoRenew" BOOLEAN NOT NULL DEFAULT true,
    "canceledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assinaturas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagamentos" (
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT,
    "userId" TEXT NOT NULL,
    "asaasPaymentId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "billingType" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "paymentDate" TIMESTAMP(3),
    "invoiceUrl" TEXT,
    "pixQrCode" TEXT,
    "bankSlipUrl" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pagamentos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "planos_name_key" ON "planos"("name");

-- CreateIndex
CREATE UNIQUE INDEX "assinaturas_asaasSubscriptionId_key" ON "assinaturas"("asaasSubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "pagamentos_asaasPaymentId_key" ON "pagamentos"("asaasPaymentId");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_cpfCnpj_key" ON "usuarios"("cpfCnpj");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_asaasCustomerId_key" ON "usuarios"("asaasCustomerId");

-- AddForeignKey
ALTER TABLE "assinaturas" ADD CONSTRAINT "assinaturas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assinaturas" ADD CONSTRAINT "assinaturas_planId_fkey" FOREIGN KEY ("planId") REFERENCES "planos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagamentos" ADD CONSTRAINT "pagamentos_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "assinaturas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagamentos" ADD CONSTRAINT "pagamentos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
