ALTER TABLE pages  ADD COLUMN IF NOT EXISTS search_vector tsvector;
ALTER TABLE blocks ADD COLUMN IF NOT EXISTS search_vector tsvector;
ALTER TABLE table_cells ADD COLUMN IF NOT EXISTS search_vector tsvector;

UPDATE pages
SET search_vector = to_tsvector('simple', coalesce(title,''))
WHERE search_vector IS NULL;

UPDATE blocks
SET search_vector = to_tsvector('simple', coalesce(content->>'text',''))
WHERE search_vector IS NULL;

UPDATE table_cells
SET search_vector = to_tsvector('simple', coalesce(value_text,''))
WHERE search_vector IS NULL;

CREATE OR REPLACE FUNCTION pages_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('simple', coalesce(NEW.title,''));
  RETURN NEW;
END $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION blocks_search_vector_update() RETURNS trigger AS $$
DECLARE txt TEXT;
BEGIN
  txt := coalesce(NEW.content->>'text','');
  NEW.search_vector := to_tsvector('simple', txt);
  RETURN NEW;
END $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION table_cells_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('simple', coalesce(NEW.value_text,''));
  RETURN NEW;
END $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_pages_search_vector ON pages;
CREATE TRIGGER trg_pages_search_vector
BEFORE INSERT OR UPDATE OF title ON pages
FOR EACH ROW EXECUTE FUNCTION pages_search_vector_update();

DROP TRIGGER IF EXISTS trg_blocks_search_vector ON blocks;
CREATE TRIGGER trg_blocks_search_vector
BEFORE INSERT OR UPDATE OF content ON blocks
FOR EACH ROW EXECUTE FUNCTION blocks_search_vector_update();

DROP TRIGGER IF EXISTS trg_table_cells_search_vector ON table_cells;
CREATE TRIGGER trg_table_cells_search_vector
BEFORE INSERT OR UPDATE OF value_text ON table_cells
FOR EACH ROW EXECUTE FUNCTION table_cells_search_vector_update();