SELECT c.id,
       max(m.sent_at) AS last_message_at
FROM conversations c
JOIN conversation_members cm ON cm.conversation_id = c.id
LEFT JOIN messages m
  ON m.conversation_id = c.id AND m.deleted_at IS NULL
WHERE cm.user_id = :user_id
GROUP BY c.id
ORDER BY last_message_at DESC NULLS LAST;