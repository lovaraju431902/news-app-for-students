-- CreateTable
CREATE TABLE IF NOT EXISTS "blog_like" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "blogId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blog_like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "comment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "blogId" TEXT NOT NULL,
    "parentId" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "bookmark" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "blogId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bookmark_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "blog_like_userId_blogId_key" ON "blog_like"("userId", "blogId");
CREATE INDEX IF NOT EXISTS "blog_like_blogId_idx" ON "blog_like"("blogId");
CREATE INDEX IF NOT EXISTS "blog_like_userId_idx" ON "blog_like"("userId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "comment_blogId_createdAt_idx" ON "comment"("blogId", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS "comment_parentId_idx" ON "comment"("parentId");
CREATE INDEX IF NOT EXISTS "comment_userId_idx" ON "comment"("userId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "bookmark_userId_blogId_key" ON "bookmark"("userId", "blogId");
CREATE INDEX IF NOT EXISTS "bookmark_userId_createdAt_idx" ON "bookmark"("userId", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS "bookmark_blogId_idx" ON "bookmark"("blogId");

-- AddForeignKey
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'blog_like_userId_fkey') THEN
        ALTER TABLE "blog_like" ADD CONSTRAINT "blog_like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'blog_like_blogId_fkey') THEN
        ALTER TABLE "blog_like" ADD CONSTRAINT "blog_like_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'comment_userId_fkey') THEN
        ALTER TABLE "comment" ADD CONSTRAINT "comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'comment_blogId_fkey') THEN
        ALTER TABLE "comment" ADD CONSTRAINT "comment_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'comment_parentId_fkey') THEN
        ALTER TABLE "comment" ADD CONSTRAINT "comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'bookmark_userId_fkey') THEN
        ALTER TABLE "bookmark" ADD CONSTRAINT "bookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'bookmark_blogId_fkey') THEN
        ALTER TABLE "bookmark" ADD CONSTRAINT "bookmark_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
