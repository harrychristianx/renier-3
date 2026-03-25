/*
  Warnings:

  - You are about to alter the column `features` on the `Property` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to alter the column `images` on the `Property` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Property" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'PHP',
    "dealType" TEXT NOT NULL,
    "propertyType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "location" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "province" TEXT,
    "bedrooms" INTEGER,
    "bathrooms" INTEGER,
    "floorAreaSqm" REAL,
    "lotAreaSqm" REAL,
    "features" JSON,
    "images" JSON,
    "videoUrl" TEXT,
    "mapEmbedUrl" TEXT,
    "agentName" TEXT,
    "agentTitle" TEXT,
    "agentPhone" TEXT,
    "agentEmail" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isLatest" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Property" ("agentEmail", "agentName", "agentPhone", "agentTitle", "bathrooms", "bedrooms", "city", "createdAt", "currency", "dealType", "description", "features", "floorAreaSqm", "id", "images", "isFeatured", "isLatest", "location", "lotAreaSqm", "mapEmbedUrl", "price", "propertyType", "province", "slug", "status", "title", "updatedAt", "videoUrl") SELECT "agentEmail", "agentName", "agentPhone", "agentTitle", "bathrooms", "bedrooms", "city", "createdAt", "currency", "dealType", "description", "features", "floorAreaSqm", "id", "images", "isFeatured", "isLatest", "location", "lotAreaSqm", "mapEmbedUrl", "price", "propertyType", "province", "slug", "status", "title", "updatedAt", "videoUrl" FROM "Property";
DROP TABLE "Property";
ALTER TABLE "new_Property" RENAME TO "Property";
CREATE UNIQUE INDEX "Property_slug_key" ON "Property"("slug");
CREATE INDEX "Property_city_idx" ON "Property"("city");
CREATE INDEX "Property_dealType_idx" ON "Property"("dealType");
CREATE INDEX "Property_propertyType_idx" ON "Property"("propertyType");
CREATE INDEX "Property_status_idx" ON "Property"("status");
CREATE INDEX "Property_price_idx" ON "Property"("price");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
