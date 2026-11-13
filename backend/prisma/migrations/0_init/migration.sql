-- CreateTable
CREATE TABLE "core_api_category" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,

    CONSTRAINT "core_api_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core_api_product" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "price" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "image" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "core_api_product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core_api_order" (
    "id" SERIAL NOT NULL,
    "full_name" VARCHAR(200) NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "address" TEXT NOT NULL,
    "total_amount" INTEGER NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "payment_id" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "core_api_order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core_api_orderitem" (
    "id" SERIAL NOT NULL,
    "price" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "orderId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "core_api_orderitem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "core_api_category_slug_key" ON "core_api_category"("slug");

-- AddForeignKey
ALTER TABLE "core_api_product" ADD CONSTRAINT "core_api_product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "core_api_category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_api_orderitem" ADD CONSTRAINT "core_api_orderitem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "core_api_order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_api_orderitem" ADD CONSTRAINT "core_api_orderitem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "core_api_product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
