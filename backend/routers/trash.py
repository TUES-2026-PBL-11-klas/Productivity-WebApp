from fastapi import status, HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session
from sqlalchemy import text
from models import User
from deps import get_current_user, get_db

router = APIRouter(prefix="/api/trash", tags=["trash"])

def get_table_and_pk(type_: str):
    if type_ == "pages":
        return "pages", "id"
    elif type_ == "blocks":
        return "blocks", "id"
    elif type_ == "events":
        return "events", "id"
    else:
        raise HTTPException(status_code=400, detail="Invalid type")

@router.post("/restore/{type_}/{item_id}", status_code=status.HTTP_200_OK)
def restore_item(type_: str, item_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    table, pk = get_table_and_pk(type_)
    sql = text(f"""
        UPDATE {table}
        SET deleted_at = NULL, deleted_by = NULL
        WHERE {pk} = :item_id AND deleted_by = :user_id
        RETURNING {pk}
    """)
    result = db.execute(sql, {"item_id": item_id, "user_id": str(user.id)})
    db.commit()
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Item not found or not in your trash")
    return {"detail": "Restored"}

@router.delete("/delete/{type_}/{item_id}", status_code=status.HTTP_200_OK)
def delete_forever(type_: str, item_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    table, pk = get_table_and_pk(type_)
    sql = text(f"""
        DELETE FROM {table}
        WHERE {pk} = :item_id AND deleted_by = :user_id
        RETURNING {pk}
    """)
    result = db.execute(sql, {"item_id": item_id, "user_id": str(user.id)})
    db.commit()
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Item not found or not in your trash")
    return {"detail": "Deleted permanently"}
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from deps import get_db, get_current_user
from models import User

router = APIRouter(prefix="/api/trash", tags=["trash"])

@router.get("/pages")
def get_trash_pages(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    sql = text("SELECT * FROM v_trash_pages WHERE deleted_by = :user_id")
    result = db.execute(sql, {"user_id": str(user.id)})
    return [dict(row) for row in result]

@router.get("/blocks")
def get_trash_blocks(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    sql = text("SELECT * FROM v_trash_blocks WHERE deleted_by = :user_id")
    result = db.execute(sql, {"user_id": str(user.id)})
    return [dict(row) for row in result]

@router.get("/events")
def get_trash_events(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    sql = text("SELECT * FROM v_trash_events WHERE deleted_by = :user_id")
    result = db.execute(sql, {"user_id": str(user.id)})
    return [dict(row) for row in result]
