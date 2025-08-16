-- CreateTable
CREATE TABLE "public"."forms" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "prompt" TEXT,
    "fields" JSONB NOT NULL,
    "fieldGroups" JSONB,
    "theme" JSONB NOT NULL DEFAULT '{}',
    "customization" JSONB NOT NULL DEFAULT '{}',
    "layout" JSONB NOT NULL DEFAULT '{}',
    "settings" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "forms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."responses" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "responses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."responses" ADD CONSTRAINT "responses_formId_fkey" FOREIGN KEY ("formId") REFERENCES "public"."forms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
