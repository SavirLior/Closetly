CREATE EXTENSION IF NOT EXISTS vector;

CREATE TYPE "WardrobeCategory" AS ENUM ('TOPS', 'BOTTOMS', 'OUTERWEAR', 'SHOES', 'ACCESSORIES');
CREATE TYPE "OutfitFeedbackType" AS ENUM ('LOVE', 'DISLIKE');
CREATE TYPE "OutfitItemRole" AS ENUM ('TOP', 'BOTTOM', 'OUTERWEAR', 'SHOES', 'ACCESSORY');
CREATE TYPE "AnalysisStatus" AS ENUM ('PENDING', 'ANALYZED', 'CONFIRMED', 'FAILED');

CREATE TABLE "User" ("id" TEXT PRIMARY KEY, "name" TEXT, "email" TEXT NOT NULL UNIQUE, "emailVerified" TIMESTAMPTZ, "image" TEXT, "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMPTZ NOT NULL);
CREATE TABLE "Account" ("id" TEXT PRIMARY KEY, "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE, "type" TEXT NOT NULL, "provider" TEXT NOT NULL, "providerAccountId" TEXT NOT NULL, "refreshToken" TEXT, "accessToken" TEXT, "expiresAt" INTEGER, "tokenType" TEXT, "scope" TEXT, "idToken" TEXT, "sessionState" TEXT, UNIQUE("provider", "providerAccountId"));
CREATE TABLE "Session" ("id" TEXT PRIMARY KEY, "sessionToken" TEXT NOT NULL UNIQUE, "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE, "expires" TIMESTAMPTZ NOT NULL);
CREATE TABLE "VerificationToken" ("identifier" TEXT NOT NULL, "token" TEXT NOT NULL UNIQUE, "expires" TIMESTAMPTZ NOT NULL, UNIQUE("identifier", "token"));

CREATE TABLE "UserPreferences" ("id" TEXT PRIMARY KEY, "userId" TEXT NOT NULL UNIQUE REFERENCES "User"("id") ON DELETE CASCADE, "preferredStyles" TEXT[] NOT NULL DEFAULT '{}', "dislikedStyles" TEXT[] NOT NULL DEFAULT '{}', "favoriteColors" TEXT[] NOT NULL DEFAULT '{}', "dislikedColors" TEXT[] NOT NULL DEFAULT '{}', "preferredFits" TEXT[] NOT NULL DEFAULT '{}', "preferredFormality" INTEGER NOT NULL DEFAULT 5, "favoriteCategories" TEXT[] NOT NULL DEFAULT '{}', "learnedScores" JSONB NOT NULL DEFAULT '{}', "onboardingComplete" BOOLEAN NOT NULL DEFAULT false, "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMPTZ NOT NULL);

CREATE TABLE "WardrobeItem" ("id" TEXT PRIMARY KEY, "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE, "name" TEXT NOT NULL, "category" "WardrobeCategory" NOT NULL, "subcategory" TEXT NOT NULL, "primaryColor" TEXT NOT NULL, "secondaryColors" TEXT[] NOT NULL DEFAULT '{}', "pattern" TEXT, "patternConfidence" DOUBLE PRECISION, "material" TEXT, "materialConfidence" DOUBLE PRECISION, "fit" TEXT, "fitConfidence" DOUBLE PRECISION, "styles" TEXT[] NOT NULL DEFAULT '{}', "seasons" TEXT[] NOT NULL DEFAULT '{}', "formality" INTEGER NOT NULL CHECK ("formality" BETWEEN 1 AND 10), "description" TEXT, "favorite" BOOLEAN NOT NULL DEFAULT false, "analysisStatus" "AnalysisStatus" NOT NULL DEFAULT 'PENDING', "analysisRaw" JSONB, "embedding" vector(1536), "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMPTZ NOT NULL);
CREATE TABLE "WardrobeItemImage" ("id" TEXT PRIMARY KEY, "wardrobeItemId" TEXT NOT NULL REFERENCES "WardrobeItem"("id") ON DELETE CASCADE, "objectKey" TEXT NOT NULL UNIQUE, "url" TEXT NOT NULL, "mimeType" TEXT NOT NULL, "sizeBytes" INTEGER NOT NULL, "width" INTEGER, "height" INTEGER, "isPrimary" BOOLEAN NOT NULL DEFAULT false, "backgroundRemoved" BOOLEAN NOT NULL DEFAULT false, "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP);

CREATE TABLE "Outfit" ("id" TEXT PRIMARY KEY, "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE, "prompt" TEXT NOT NULL, "occasion" TEXT, "style" TEXT, "formality" INTEGER, "season" TEXT, "weatherSnapshot" JSONB, "compatibilityScore" DOUBLE PRECISION NOT NULL, "scoreBreakdown" JSONB, "explanation" TEXT NOT NULL, "provider" TEXT, "model" TEXT, "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE "OutfitItem" ("outfitId" TEXT NOT NULL REFERENCES "Outfit"("id") ON DELETE CASCADE, "wardrobeItemId" TEXT NOT NULL REFERENCES "WardrobeItem"("id") ON DELETE RESTRICT, "role" "OutfitItemRole" NOT NULL, "position" INTEGER NOT NULL DEFAULT 0, "locked" BOOLEAN NOT NULL DEFAULT false, PRIMARY KEY ("outfitId", "wardrobeItemId"));
CREATE TABLE "OutfitFeedback" ("id" TEXT PRIMARY KEY, "outfitId" TEXT NOT NULL REFERENCES "Outfit"("id") ON DELETE CASCADE, "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE, "type" "OutfitFeedbackType" NOT NULL, "reason" TEXT, "itemId" TEXT, "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE "SavedOutfit" ("id" TEXT PRIMARY KEY, "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE, "sourceOutfitId" TEXT REFERENCES "Outfit"("id") ON DELETE SET NULL, "title" TEXT NOT NULL, "favorite" BOOLEAN NOT NULL DEFAULT false, "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMPTZ NOT NULL);
CREATE TABLE "SavedOutfitItem" ("savedOutfitId" TEXT NOT NULL REFERENCES "SavedOutfit"("id") ON DELETE CASCADE, "wardrobeItemId" TEXT NOT NULL REFERENCES "WardrobeItem"("id") ON DELETE RESTRICT, "role" "OutfitItemRole" NOT NULL, "position" INTEGER NOT NULL DEFAULT 0, PRIMARY KEY ("savedOutfitId", "wardrobeItemId"));

CREATE INDEX "WardrobeItem_userId_category_idx" ON "WardrobeItem"("userId", "category");
CREATE INDEX "WardrobeItem_userId_favorite_idx" ON "WardrobeItem"("userId", "favorite");
CREATE INDEX "WardrobeItem_userId_createdAt_idx" ON "WardrobeItem"("userId", "createdAt");
CREATE INDEX "WardrobeItem_embedding_idx" ON "WardrobeItem" USING hnsw ("embedding" vector_cosine_ops);
CREATE INDEX "Outfit_userId_createdAt_idx" ON "Outfit"("userId", "createdAt");
CREATE INDEX "OutfitFeedback_userId_createdAt_idx" ON "OutfitFeedback"("userId", "createdAt");
CREATE INDEX "SavedOutfit_userId_createdAt_idx" ON "SavedOutfit"("userId", "createdAt");
