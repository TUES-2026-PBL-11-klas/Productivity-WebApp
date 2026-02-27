from fastapi import APIRouter, Depends, HTTPException, Query, Body
from sqlalchemy.orm import Session
from sqlalchemy import text
from models import Workspace, WorkspaceMember, User
from schemas import WorkspaceCreate, WorkspaceResponse, WorkspaceMemberCreate
from deps import get_db, get_current_user
import uuid

router = APIRouter(prefix="/api/workspaces", tags=["workspaces"])


# Search endpoint - must come before dynamic routes
@router.get("/search/items")
def search_items(
    q: str = Query(..., min_length=1),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Search pages, blocks, and table cells using full-text search"""
    user_id = str(current_user.id)
    query_param = q.strip()
    
    results = {
        "pages": [],
        "blocks": [],
        "cells": []
    }
    
    try:
        # Search pages using full-text search vector
        pages_query = text("""
            SELECT p.id, p.workspace_id, p.title
            FROM pages p
            JOIN workspace_members wm ON wm.workspace_id = p.workspace_id
            WHERE wm.user_id = :user_id
              AND p.deleted_at IS NULL
              AND p.search_vector @@ plainto_tsquery('simple', :q)
            ORDER BY p.updated_at DESC
            LIMIT 50
        """)
        pages = db.execute(
            pages_query,
            {"user_id": user_id, "q": query_param}
        ).fetchall()
        results["pages"] = [{"id": str(p[0]), "workspace_id": str(p[1]), "title": p[2]} for p in pages]
        
        # Search blocks using full-text search vector
        blocks_query = text("""
            SELECT b.id, b.page_id, b.type
            FROM blocks b
            JOIN pages p ON p.id = b.page_id
            JOIN workspace_members wm ON wm.workspace_id = p.workspace_id
            WHERE wm.user_id = :user_id
              AND b.deleted_at IS NULL
              AND b.search_vector @@ plainto_tsquery('simple', :q)
            ORDER BY b.updated_at DESC
            LIMIT 50
        """)
        blocks = db.execute(
            blocks_query,
            {"user_id": user_id, "q": query_param}
        ).fetchall()
        results["blocks"] = [{"id": str(b[0]), "page_id": str(b[1]), "type": b[2]} for b in blocks]
        
        # Search table cells
        cells_query = text("""
            SELECT tc.row_id, tc.column_id
            FROM table_cells tc
            JOIN table_rows tr ON tr.id = tc.row_id
            JOIN tables t ON t.id = tr.table_id
            JOIN workspace_members wm ON wm.workspace_id = t.workspace_id
            WHERE wm.user_id = :user_id
              AND t.deleted_at IS NULL
              AND tc.search_vector @@ plainto_tsquery('simple', :q)
            LIMIT 50
        """)
        cells = db.execute(
            cells_query,
            {"user_id": user_id, "q": query_param}
        ).fetchall()
        results["cells"] = [{"row_id": str(c[0]), "column_id": str(c[1])} for c in cells]
        
    except Exception as e:
        print(f"Search error: {e}")
        # Return empty results if tables don't exist yet
        pass
    
    return results


# Create workspace
@router.post("/", response_model=WorkspaceResponse)
def create_workspace(workspace: WorkspaceCreate, db: Session = Depends(get_db)):
    new_workspace = Workspace(
        name=workspace.name,
        owner_id=workspace.owner_id,
        visibility=workspace.visibility
    )
    db.add(new_workspace)
    db.commit()
    db.refresh(new_workspace)
    return new_workspace


# List all workspaces
@router.get("/")
def list_workspaces(db: Session = Depends(get_db)):
    workspaces = db.query(Workspace).all()
    return {"workspaces": workspaces}


# Get single workspace - must come after static routes
@router.get("/{workspace_id}", response_model=WorkspaceResponse)
def get_workspace(workspace_id: str, db: Session = Depends(get_db)):
    workspace = db.query(Workspace).filter(Workspace.id == workspace_id).first()
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return workspace


# Add workspace member
@router.post("/{workspace_id}/members")
def add_workspace_member(
    workspace_id: str,
    member: WorkspaceMemberCreate,
    db: Session = Depends(get_db),
):
    print("DEBUG: Received member:", member)
    user_id = str(member.user_id)
    role = member.role or "member"
    print("DEBUG: user_id:", user_id, "role:", role)

    workspace = db.query(Workspace).filter(Workspace.id == workspace_id).first()
    print("DEBUG: workspace:", workspace)
    if not workspace:
        print("DEBUG: Workspace not found")
        raise HTTPException(status_code=404, detail="Workspace not found")

    user = db.query(User).filter(User.id == user_id).first()
    print("DEBUG: user:", user)
    if not user:
        print("DEBUG: User not found")
        raise HTTPException(status_code=404, detail="User not found")

    existing_member = db.query(WorkspaceMember).filter(
        WorkspaceMember.workspace_id == workspace_id,
        WorkspaceMember.user_id == user_id
    ).first()
    print("DEBUG: existing_member:", existing_member)
    if existing_member:
        print("DEBUG: User is already a member")
        raise HTTPException(status_code=400, detail="User is already a member")

    try:
        new_member = WorkspaceMember(
            workspace_id=workspace_id,
            user_id=user_id,
            role=role,
            can_create_pages=member.can_create_pages or "0",
            can_create_blocks=member.can_create_blocks or "0",
            can_invite_members=member.can_invite_members or "0"
        )
        print("DEBUG: new_member object created")
        db.add(new_member)
        db.commit()
        db.refresh(new_member)
        print("DEBUG: new_member committed and refreshed")
    except Exception as e:
        print("DEBUG: Exception occurred while adding member:", e)
        raise HTTPException(status_code=500, detail=str(e))
    return {"message": "Member added", "member": new_member}
