SELECT p.id, p.workspace_id, p.title
FROM pages p
JOIN workspace_members wm ON wm.workspace_id = p.workspace_id
WHERE wm.user_id = :user_id
  AND p.deleted_at IS NULL
  AND p.search_vector @@ plainto_tsquery('simple', :q)
ORDER BY p.updated_at DESC
LIMIT 50;

SELECT b.id, b.page_id, b.type
FROM blocks b
JOIN pages p ON p.id = b.page_id
JOIN workspace_members wm ON wm.workspace_id = p.workspace_id
WHERE wm.user_id = :user_id
  AND b.deleted_at IS NULL
  AND b.search_vector @@ plainto_tsquery('simple', :q)
ORDER BY b.updated_at DESC
LIMIT 50;

SELECT tc.row_id, tc.column_id
FROM table_cells tc
JOIN table_rows tr ON tr.id = tc.row_id
JOIN tables t ON t.id = tr.table_id
JOIN workspace_members wm ON wm.workspace_id = t.workspace_id
WHERE wm.user_id = :user_id
  AND t.deleted_at IS NULL
  AND tc.search_vector @@ plainto_tsquery('simple', :q)
LIMIT 50;