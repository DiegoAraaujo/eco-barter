/*
  Warnings:

  - The `category` column on the `Item` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."categoryName" AS ENUM ('BRINQUEDOS', 'CALCADOS', 'CELULARES', 'ELETRODOMESTICOS', 'ESPORTES', 'INFORMATICA', 'JARDINAGEM', 'LIVROS', 'MOVEIS', 'ROUPAS');

-- AlterTable
ALTER TABLE "public"."Item" DROP COLUMN "category",
ADD COLUMN     "category" "public"."categoryName";
