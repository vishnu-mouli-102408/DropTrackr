/*
  Warnings:

  - You are about to drop the `Model` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OutputImages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PackPrompts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Packs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subscription` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserCredit` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Model" DROP CONSTRAINT "Model_userId_fkey";

-- DropForeignKey
ALTER TABLE "OutputImages" DROP CONSTRAINT "OutputImages_modelId_fkey";

-- DropForeignKey
ALTER TABLE "OutputImages" DROP CONSTRAINT "OutputImages_userId_fkey";

-- DropForeignKey
ALTER TABLE "PackPrompts" DROP CONSTRAINT "PackPrompts_packId_fkey";

-- DropTable
DROP TABLE "Model";

-- DropTable
DROP TABLE "OutputImages";

-- DropTable
DROP TABLE "PackPrompts";

-- DropTable
DROP TABLE "Packs";

-- DropTable
DROP TABLE "Subscription";

-- DropTable
DROP TABLE "Transaction";

-- DropTable
DROP TABLE "UserCredit";

-- DropEnum
DROP TYPE "EthenecityEnum";

-- DropEnum
DROP TYPE "EyeColorEnum";

-- DropEnum
DROP TYPE "ModelTrainingStatusEnum";

-- DropEnum
DROP TYPE "ModelTypeEnum";

-- DropEnum
DROP TYPE "OutputImageStatusEnum";

-- DropEnum
DROP TYPE "PlanType";

-- DropEnum
DROP TYPE "TransactionStatus";
