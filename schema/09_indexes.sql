CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

CREATE INDEX IF NOT EXISTS idx_workspaces_owner ON workspaces(owner_id);
CREATE INDEX IF NOT EXISTS idx_workspaces_visibility ON workspaces(visibility);
CREATE INDEX IF NOT EXISTS idx_ws_members_user ON workspace_members(user_id);

CREATE INDEX IF NOT EXISTS idx_pages_workspace ON pages(workspace_id);
CREATE INDEX IF NOT EXISTS idx_pages_parent ON pages(parent_id);
CREATE INDEX IF NOT EXISTS idx_pages_deleted ON pages(deleted_at);

CREATE INDEX IF NOT EXISTS idx_blocks_page ON blocks(page_id);
CREATE INDEX IF NOT EXISTS idx_blocks_type ON blocks(type);
CREATE INDEX IF NOT EXISTS idx_blocks_deleted ON blocks(deleted_at);
CREATE INDEX IF NOT EXISTS idx_blocks_table_id ON blocks(table_id);
CREATE INDEX IF NOT EXISTS idx_blocks_calendar_id ON blocks(calendar_id);

CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);

CREATE INDEX IF NOT EXISTS idx_conv_members_user ON conversation_members(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conv_time ON messages(conversation_id, sent_at);

CREATE INDEX IF NOT EXISTS idx_calendars_workspace ON calendars(workspace_id);
CREATE INDEX IF NOT EXISTS idx_events_workspace_time ON events(workspace_id, starts_at);
CREATE INDEX IF NOT EXISTS idx_events_calendar_time ON events(calendar_id, starts_at);
CREATE INDEX IF NOT EXISTS idx_events_time ON events(starts_at);
CREATE INDEX IF NOT EXISTS idx_events_deleted ON events(deleted_at);

CREATE INDEX IF NOT EXISTS idx_tables_workspace ON tables(workspace_id);
CREATE INDEX IF NOT EXISTS idx_tables_deleted ON tables(deleted_at);

CREATE INDEX IF NOT EXISTS idx_table_columns_table ON table_columns(table_id);
CREATE UNIQUE INDEX IF NOT EXISTS uq_table_columns_position ON table_columns(table_id, position);

CREATE INDEX IF NOT EXISTS idx_table_rows_table ON table_rows(table_id);
CREATE UNIQUE INDEX IF NOT EXISTS uq_table_rows_position ON table_rows(table_id, position);

CREATE INDEX IF NOT EXISTS idx_cells_row ON table_cells(row_id);
CREATE INDEX IF NOT EXISTS idx_cells_col ON table_cells(column_id);

CREATE INDEX IF NOT EXISTS gin_pages_search ON pages USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS gin_blocks_search ON blocks USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS gin_table_cells_search ON table_cells USING GIN (search_vector);