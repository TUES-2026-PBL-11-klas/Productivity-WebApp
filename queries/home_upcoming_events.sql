SELECT e.*
FROM events e
JOIN workspace_members wm ON wm.workspace_id = e.workspace_id
WHERE wm.user_id = :user_id
  AND e.deleted_at IS NULL
  AND e.starts_at >= now()
ORDER BY e.starts_at
LIMIT 50;