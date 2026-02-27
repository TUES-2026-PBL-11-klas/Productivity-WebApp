from pathlib import Path
from sqlalchemy import text
from database import engine


def run_sql_file(file_path: str) -> None:
    with open(file_path, 'r') as f:
        sql_content = f.read()
    
    with engine.connect() as connection:
        try:
            connection.execute(text(sql_content))
            connection.commit()
        except Exception as e:
            print(f"Error executing {file_path}: {e}")
            connection.rollback()


def init_database() -> None:
    schema_dir = Path(__file__).parent.parent / "schema"
    
    if not schema_dir.exists():
        return
    
    schema_order = [
        "01_extensions.sql",
        "1_users.sql",
        "2_workspace_members.sql",
        "3_pages_blocks.sql",
        "4_favorites.sql",
        "5_messaging.sql",
        "6_calendars_events.sql",
        "7_tables.sql",
        "8_search.sql",
        "9_indexes.sql",
        "9_trash_views.sql",
    ]
    
    for filename in schema_order:
        file_path = schema_dir / filename
        if file_path.exists():
            run_sql_file(str(file_path))


if __name__ == "__main__":
    init_database()
