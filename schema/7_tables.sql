DO $$ BEGIN
  CREATE TYPE table_column_type AS ENUM ('text','number','date','checkbox');
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Table',
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS table_columns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id UUID NOT NULL REFERENCES tables(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  col_type table_column_type NOT NULL DEFAULT 'text',
  position INTEGER NOT NULL DEFAULT 0,
  is_required BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS table_rows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id UUID NOT NULL REFERENCES tables(id) ON DELETE CASCADE,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS table_cells (
  row_id UUID NOT NULL REFERENCES table_rows(id) ON DELETE CASCADE,
  column_id UUID NOT NULL REFERENCES table_columns(id) ON DELETE CASCADE,

  value_text   TEXT,
  value_number NUMERIC,
  value_date   DATE,
  value_bool   BOOLEAN,

  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES users(id),
  PRIMARY KEY (row_id, column_id)
);

DO $$ BEGIN
  ALTER TABLE blocks
    ADD CONSTRAINT fk_blocks_table
    FOREIGN KEY (table_id) REFERENCES tables(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE blocks
    ADD CONSTRAINT fk_blocks_calendar
    FOREIGN KEY (calendar_id) REFERENCES calendars(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

ALTER TABLE blocks
  DROP CONSTRAINT IF EXISTS chk_blocks_object_match;

ALTER TABLE blocks
  ADD CONSTRAINT chk_blocks_object_match CHECK (
    (type = 'table' AND table_id IS NOT NULL AND calendar_id IS NULL) OR
    (type = 'calendar' AND calendar_id IS NOT NULL AND table_id IS NULL) OR
    (type NOT IN ('table','calendar') AND table_id IS NULL AND calendar_id IS NULL)
  );