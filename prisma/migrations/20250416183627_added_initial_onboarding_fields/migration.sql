/*
  Warnings:

  - A unique constraint covering the columns `[email,username]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "IndustryType" AS ENUM ('HEALTHCARE', 'BEAUTY', 'WELLNESS', 'SPORTS', 'CULINARY', 'BARBERSHOPS', 'EDUCATION', 'OTHERS');

-- CreateEnum
CREATE TYPE "Locale" AS ENUM ('EN', 'PT');

-- CreateEnum
CREATE TYPE "IdentityProvider" AS ENUM ('MARKADO', 'GOOGLE');

-- CreateEnum
CREATE TYPE "BusinessLocationType" AS ENUM ('ONLINE', 'IN_PERSON');

-- CreateEnum
CREATE TYPE "BrazilianStatesAcronyms" AS ENUM ('AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "biography" TEXT,
ADD COLUMN     "completedOnboarding" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "identityProvider" "IdentityProvider" DEFAULT 'MARKADO',
ADD COLUMN     "locale" "Locale" DEFAULT 'PT',
ADD COLUMN     "timeZone" TEXT NOT NULL DEFAULT 'America/Sao_Paulo',
ADD COLUMN     "username" TEXT;

-- CreateTable
CREATE TABLE "UserPassword" (
    "hash" TEXT NOT NULL,
    "userId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "BusinessLocation" (
    "id" SERIAL NOT NULL,
    "cep" TEXT NOT NULL,
    "state" "BrazilianStatesAcronyms" NOT NULL,
    "city" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "complement" TEXT NOT NULL,

    CONSTRAINT "BusinessLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "industryType" "IndustryType",
    "slug" TEXT,
    "linkedinUrl" TEXT,
    "twitterUrl" TEXT,
    "instagramUrl" TEXT,
    "businessLocationId" INTEGER NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPassword_userId_key" ON "UserPassword"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Team_slug_key" ON "Team"("slug");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_emailVerified_idx" ON "User"("emailVerified");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_username_key" ON "User"("email", "username");

-- AddForeignKey
ALTER TABLE "UserPassword" ADD CONSTRAINT "UserPassword_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_businessLocationId_fkey" FOREIGN KEY ("businessLocationId") REFERENCES "BusinessLocation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
