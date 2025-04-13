-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateEnum
CREATE TYPE "user_status" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDENT');

-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('ADMIN', 'GUEST', 'HOST');

-- CreateEnum
CREATE TYPE "property_type" AS ENUM ('HOUSE', 'APARTMENT', 'ROOM', 'OTHER');

-- CreateEnum
CREATE TYPE "property_status" AS ENUM ('AVAILABLE', 'UNAVAILABLE');

-- CreateEnum
CREATE TYPE "reservation_status" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELED');

-- CreateEnum
CREATE TYPE "event_type" AS ENUM ('CHECKIN', 'CHECKOUT');

-- CreateEnum
CREATE TYPE "event_status" AS ENUM ('PENDING', 'COMPLETED', 'CANCELED');

-- CreateEnum
CREATE TYPE "review_type" AS ENUM ('GUEST_TO_HOST', 'HOST_TO_GUEST');

-- CreateEnum
CREATE TYPE "transaction_type" AS ENUM ('GUEST_PAYMENT', 'HOST_PAYOUT');

-- CreateEnum
CREATE TYPE "invoice_status" AS ENUM ('PENDING', 'PAID', 'CANCELED');

-- CreateTable
CREATE TABLE "app_user" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "name" TEXT,
    "role" "user_role"[] DEFAULT ARRAY['GUEST']::"user_role"[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "status" "user_status" NOT NULL DEFAULT 'ACTIVE',
    "phone" TEXT,
    "contract_number" TEXT,
    "is_holder" BOOLEAN NOT NULL DEFAULT false,
    "cpf" TEXT,
    "birth_date" TIMESTAMP(3),
    "address" TEXT,
    "address_number" TEXT,
    "neighborhood" TEXT,
    "postal_code" TEXT,
    "city" TEXT,
    "address_complement" TEXT,
    "state" TEXT,

    CONSTRAINT "app_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "type" "transaction_type" NOT NULL,
    "status" "invoice_status" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commodity" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "commodity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_commodity" (
    "property_id" TEXT NOT NULL,
    "commodity_id" INTEGER NOT NULL,

    CONSTRAINT "property_commodity_pkey" PRIMARY KEY ("property_id","commodity_id")
);

-- CreateTable
CREATE TABLE "photo" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "property_id" TEXT NOT NULL,

    CONSTRAINT "photo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "property_type" NOT NULL,
    "status" "property_status" NOT NULL DEFAULT 'AVAILABLE',
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "zip_code" TEXT NOT NULL,
    "price_per_night" DECIMAL(10,2) NOT NULL,
    "host_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservation" (
    "id" TEXT NOT NULL,
    "property_id" TEXT NOT NULL,
    "guest_id" TEXT NOT NULL,
    "check_in" TIMESTAMP(3) NOT NULL,
    "check_out" TIMESTAMP(3) NOT NULL,
    "guest_count" INTEGER NOT NULL,
    "total_price" DECIMAL(10,2) NOT NULL,
    "status" "reservation_status" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "check_event" (
    "id" SERIAL NOT NULL,
    "reservation_id" TEXT NOT NULL,
    "type" "event_type" NOT NULL,
    "event_date" TIMESTAMP(3) NOT NULL,
    "status" "event_status" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "check_event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review" (
    "id" SERIAL NOT NULL,
    "reservation_id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "type" "review_type" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "app_user_email_key" ON "app_user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "app_user_cpf_key" ON "app_user"("cpf");

-- CreateIndex
CREATE INDEX "app_user_email_idx" ON "app_user"("email");

-- CreateIndex
CREATE INDEX "app_user_contract_number_idx" ON "app_user"("contract_number");

-- CreateIndex
CREATE INDEX "app_user_cpf_idx" ON "app_user"("cpf");

-- CreateIndex
CREATE INDEX "transaction_user_id_idx" ON "transaction"("user_id");

-- CreateIndex
CREATE INDEX "property_commodity_property_id_idx" ON "property_commodity"("property_id");

-- CreateIndex
CREATE INDEX "property_commodity_commodity_id_idx" ON "property_commodity"("commodity_id");

-- CreateIndex
CREATE INDEX "photo_property_id_idx" ON "photo"("property_id");

-- CreateIndex
CREATE INDEX "property_host_id_idx" ON "property"("host_id");

-- CreateIndex
CREATE INDEX "reservation_property_id_idx" ON "reservation"("property_id");

-- CreateIndex
CREATE INDEX "reservation_guest_id_idx" ON "reservation"("guest_id");

-- CreateIndex
CREATE INDEX "check_event_reservation_id_idx" ON "check_event"("reservation_id");

-- CreateIndex
CREATE INDEX "review_reservation_id_idx" ON "review"("reservation_id");

-- CreateIndex
CREATE INDEX "review_author_id_idx" ON "review"("author_id");

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_commodity" ADD CONSTRAINT "property_commodity_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_commodity" ADD CONSTRAINT "property_commodity_commodity_id_fkey" FOREIGN KEY ("commodity_id") REFERENCES "commodity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photo" ADD CONSTRAINT "photo_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property" ADD CONSTRAINT "property_host_id_fkey" FOREIGN KEY ("host_id") REFERENCES "app_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation" ADD CONSTRAINT "reservation_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation" ADD CONSTRAINT "reservation_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "app_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_event" ADD CONSTRAINT "check_event_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "app_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
