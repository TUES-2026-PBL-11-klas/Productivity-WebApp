SELECT 'page' AS item_type, p.id, p.title AS label, p.deleted_at
FROM pages p
JOIN workspace_members wm ON wm.workspace_id = p.workspace_id
WHERE wm.user_id = :user_id AND p.deleted_at IS NOT NULL

UNION ALL

SELECT 'block' AS item_type, b.id, b.type::text AS label, b.deleted_at
FROM blocks b
JOIN pages p ON p.id = b.page_id
JOIN workspace_members wm ON wm.workspace_id = p.workspace_id
WHERE wm.user_id = :user_id AND b.deleted_at IS NOT NULL

UNION ALL

SELECT 'event' AS item_type, e.id, e.title AS label, e.deleted_at
FROM events e
JOIN workspace_members wm ON wm.workspace_id = e.workspace_id
WHERE wm.user_id = :user_id AND e.deleted_at IS NOT NULL

ORDER BY deleted_at DESC
LIMIT 200;