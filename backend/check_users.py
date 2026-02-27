from sqlalchemy import create_engine, text
engine = create_engine('postgresql://postgres:133313@localhost:5432/productivity_db')
with engine.connect() as conn:
    result = conn.execute(text('SELECT id, email, display_name FROM users'))
    for row in result:
        print(dict(row._mapping))
