
CREATE OR REPLACE VIEW v_trash_pages AS
SELECT id, workspace_id, title, deleted_at, deleted_by
FROM pages
WHERE deleted_at IS NOT NULL;

CREATE OR REPLACE VIEW v_trash_blocks AS
SELECT b.id, p.workspace_id, b.page_id, b.type, b.deleted_at, b.deleted_by
FROM blocks b
JOIN pages p ON p.id = b.page_id
WHERE b.deleted_at IS NOT NULL;

CREATE OR REPLACE VIEW v_trash_events AS
SELECT id, workspace_id, title, deleted_at, deleted_by
FROM events
WHERE deleted_at IS NOT NULL;