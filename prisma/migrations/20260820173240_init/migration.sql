-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Sexo" AS ENUM ('MACHO', 'FEMEA');

-- CreateTable
CREATE TABLE "Tutor" (
    "id" TEXT NOT NULL,
    "nomeCompleto" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "email" TEXT,
    "autorizaWhatsapp" BOOLEAN NOT NULL DEFAULT false,
    "aceitouPoliticaPrivacidade" BOOLEAN NOT NULL DEFAULT false,
    "politicaAceitaEm" TIMESTAMP(3),
    "politicaVersao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tutor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cao" (
    "id" TEXT NOT NULL,
    "tutorId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "idadeAnos" INTEGER NOT NULL,
    "raca" TEXT NOT NULL,
    "sexo" "Sexo" NOT NULL,
    "pesoKg" DECIMAL(5,2) NOT NULL,
    "fotoBytes" BYTEA NOT NULL,
    "fotoMimeType" TEXT NOT NULL,
    "numeroSequencial" SERIAL NOT NULL,
    "verificationToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tutor_whatsapp_key" ON "Tutor"("whatsapp");

-- CreateIndex
CREATE UNIQUE INDEX "Cao_verificationToken_key" ON "Cao"("verificationToken");

-- CreateIndex
CREATE INDEX "Cao_tutorId_idx" ON "Cao"("tutorId");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_username_key" ON "AdminUser"("username");

-- AddForeignKey
ALTER TABLE "Cao" ADD CONSTRAINT "Cao_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "Tutor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

