import json
from sqlalchemy import create_engine, text

engine = create_engine('postgresql://postgres:133313@localhost:5432/productivity_db')
schema = {}
with engine.connect() as conn:
    for table in ['users', 'workspaces', 'workspace_members']:
        rs = conn.execute(text(f"SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '{table}';"))
        schema[table] = [list(row) for row in rs]

with open('schema.json', 'w') as f:
    json.dump(schema, f, indent=2)


