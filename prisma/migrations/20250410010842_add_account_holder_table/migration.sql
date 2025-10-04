-- CreateTable
CREATE TABLE "account_holders" (
    "id" TEXT NOT NULL,
    "record_account_holder_id" TEXT NOT NULL,
    "record_account_holder_name" TEXT,
    "wallet_address" TEXT NOT NULL,
    "cdp_wallet_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_holders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "account_holders_record_account_holder_id_key" ON "account_holders"("record_account_holder_id");

-- CreateIndex
CREATE UNIQUE INDEX "account_holders_wallet_address_key" ON "account_holders"("wallet_address");

-- CreateIndex
CREATE UNIQUE INDEX "account_holders_cdp_wallet_id_key" ON "account_holders"("cdp_wallet_id");
