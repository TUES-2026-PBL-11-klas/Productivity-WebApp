from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import Workspace, WorkspaceMember, User
from schemas import WorkspaceCreate, WorkspaceResponse, WorkspaceMemberCreate
from deps import get_db
import uuid

router = APIRouter(prefix="/api/workspaces", tags=["workspaces"])


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


@router.get("/{workspace_id}", response_model=WorkspaceResponse)
def get_workspace(workspace_id: str, db: Session = Depends(get_db)):
    workspace = db.query(Workspace).filter(Workspace.id == workspace_id).first()
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return workspace


@router.get("/")
def list_workspaces(db: Session = Depends(get_db)):
    workspaces = db.query(Workspace).all()
    return {"workspaces": workspaces}


from fastapi import Body

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
