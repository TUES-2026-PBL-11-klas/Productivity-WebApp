DO $$ BEGIN
  CREATE TYPE favorite_target AS ENUM ('workspace','page');
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS favorites (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_type favorite_target NOT NULL,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, target_type, workspace_id, page_id),
  CHECK (
    (target_type='workspace' AND workspace_id IS NOT NULL AND page_id IS NULL) OR
    (target_type='page' AND page_id IS NOT NULL AND workspace_id IS NULL)
  )
);