-- 1. Add column search_vector of type tsvector to the Blog table
ALTER TABLE "Blog" ADD COLUMN IF NOT EXISTS "search_vector" tsvector;

-- 2. Create the trigger function to automatically update search_vector
-- Weights: title (A = 1.0), excerpt (B = 0.4), content (C = 0.2), seoKeywords (D = 0.1)
CREATE OR REPLACE FUNCTION blog_search_vector_trigger() RETURNS trigger AS $$
BEGIN
  NEW."search_vector" :=
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.excerpt, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.content, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(NEW."seoKeywords", '')), 'D');
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

-- 3. Bind trigger to the Blog table
DROP TRIGGER IF EXISTS blog_search_vector_update ON "Blog";
CREATE TRIGGER blog_search_vector_update
BEFORE INSERT OR UPDATE ON "Blog"
FOR EACH ROW EXECUTE FUNCTION blog_search_vector_trigger();

-- 4. Backfill existing blogs to populate search_vector
UPDATE "Blog" SET "search_vector" =
  setweight(to_tsvector('english', COALESCE(title, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(excerpt, '')), 'B') ||
  setweight(to_tsvector('english', COALESCE(content, '')), 'C') ||
  setweight(to_tsvector('english', COALESCE("seoKeywords", '')), 'D');

-- 5. Create a GIN index on the search_vector column for high performance
CREATE INDEX IF NOT EXISTS blog_search_vector_idx ON "Blog" USING GIN ("search_vector");

-- 6. Create the fuzzy/prefix matching search function
CREATE OR REPLACE FUNCTION search_blogs(search_term text)
RETURNS TABLE (
  id text,
  title text,
  slug text,
  excerpt text,
  "featuredImg" text,
  "createdAt" timestamp,
  rank real
) AS $$
DECLARE
  parsed_query tsquery;
BEGIN
  -- Split search term into clean alphanumeric words, append ':*' for prefix matching, and join with '&' (AND logic)
  SELECT string_agg(word || ':*', ' & ')::tsquery INTO parsed_query
  FROM unnest(string_to_array(regexp_replace(trim(search_term), '[^\w\s\-\.]', '', 'g'), ' ')) AS word
  WHERE word <> '';

  -- Fallback to standard plainto_tsquery if parsed_query is null or empty
  IF parsed_query IS NULL OR parsed_query = ''::tsquery THEN
    parsed_query := plainto_tsquery('english', search_term);
  END IF;

  RETURN QUERY
  SELECT 
    b.id::text,
    b.title::text,
    b.slug::text,
    b.excerpt::text,
    b."featuredImg"::text,
    b."createdAt"::timestamp,
    ts_rank_cd(b.search_vector, parsed_query)::real AS rank
  FROM "Blog" b
  WHERE b.search_vector @@ parsed_query
  ORDER BY rank DESC;
END;
$$ LANGUAGE plpgsql;
