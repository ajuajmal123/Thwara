-- ==============================================================================
-- One-off cleanup: remove all test content before launch.
--
-- Run in Supabase Dashboard -> SQL Editor. This permanently deletes every row
-- in the content tables below. It cannot be undone, so export the tables first
-- (Table Editor -> each table -> Export to CSV) if you may need anything back.
--
-- Not touched:
--   * public.submissions  (pitches sent through the public form)
--   * Storage files in the `media` bucket. Remove test uploads in
--     Dashboard -> Storage -> media -> uploads.
-- ==============================================================================

BEGIN;

-- 1. See what will be deleted
SELECT 'articles'  AS table_name, count(*) FROM public.articles
UNION ALL SELECT 'fictions',  count(*) FROM public.fictions
UNION ALL SELECT 'folklores', count(*) FROM public.folklores
UNION ALL SELECT 'webzines',  count(*) FROM public.webzines
UNION ALL SELECT 'tellings',  count(*) FROM public.tellings
UNION ALL SELECT 'authors',   count(*) FROM public.authors;

-- 2. Delete everything and reset the id counters
TRUNCATE TABLE
  public.articles,
  public.fictions,
  public.folklores,
  public.webzines,
  public.tellings,
  public.authors
RESTART IDENTITY;

COMMIT;
