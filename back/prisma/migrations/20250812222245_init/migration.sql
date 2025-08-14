-- CreateEnum
CREATE TYPE "public"."ItemStatus" AS ENUM ('AVAILABLE', 'RESERVED', 'SOLD');

-- CreateEnum
CREATE TYPE "public"."ItemCondition" AS ENUM ('NEW', 'USED', 'REFURBISHED');

-- CreateEnum
CREATE TYPE "public"."ExchangeStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED');

-- CreateTable
CREATE TABLE "public"."Account" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "registeredAt" TIMESTAMP(3),
    "passwordHash" TEXT,
    "fullName" TEXT,
    "phone" TEXT,
    "city" TEXT,
    "state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Item" (
    "id" SERIAL NOT NULL,
    "accountId" INTEGER NOT NULL,
    "name" TEXT,
    "registeredAt" TIMESTAMP(3),
    "imageUrl" TEXT,
    "category" TEXT,
    "description" TEXT,
    "status" "public"."ItemStatus",
    "condition" "public"."ItemCondition",

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Exchange" (
    "id" SERIAL NOT NULL,
    "senderItemId" INTEGER NOT NULL,
    "receiverItemId" INTEGER NOT NULL,
    "senderAccountId" INTEGER NOT NULL,
    "receiverAccountId" INTEGER NOT NULL,
    "exchangedAt" TIMESTAMP(3),
    "status" "public"."ExchangeStatus",

    CONSTRAINT "Exchange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ExchangeReview" (
    "id" SERIAL NOT NULL,
    "exchangeId" INTEGER NOT NULL,
    "rating" INTEGER,
    "comment" TEXT,

    CONSTRAINT "ExchangeReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_key" ON "public"."Account"("email");

-- AddForeignKey
ALTER TABLE "public"."Item" ADD CONSTRAINT "Item_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Exchange" ADD CONSTRAINT "Exchange_senderItemId_fkey" FOREIGN KEY ("senderItemId") REFERENCES "public"."Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Exchange" ADD CONSTRAINT "Exchange_receiverItemId_fkey" FOREIGN KEY ("receiverItemId") REFERENCES "public"."Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Exchange" ADD CONSTRAINT "Exchange_senderAccountId_fkey" FOREIGN KEY ("senderAccountId") REFERENCES "public"."Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Exchange" ADD CONSTRAINT "Exchange_receiverAccountId_fkey" FOREIGN KEY ("receiverAccountId") REFERENCES "public"."Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ExchangeReview" ADD CONSTRAINT "ExchangeReview_exchangeId_fkey" FOREIGN KEY ("exchangeId") REFERENCES "public"."Exchange"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
