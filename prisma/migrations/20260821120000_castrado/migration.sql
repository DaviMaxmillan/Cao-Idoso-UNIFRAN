-- AlterTable
-- O DEFAULT preenche os cadastros que já existiam; o schema não declara
-- @default, então todo cadastro novo precisa informar o valor explicitamente.
ALTER TABLE "Cao" ADD COLUMN     "castrado" BOOLEAN NOT NULL DEFAULT false;
