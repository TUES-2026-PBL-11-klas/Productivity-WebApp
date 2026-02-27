from pydantic import BaseModel, EmailStr
from typing import List, Optional
from uuid import UUID

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str


class WorkspaceCreate(BaseModel):
    name: str
    owner_id: UUID
    visibility: str = "private"

class WorkspaceResponse(BaseModel):
    id: UUID
    name: str
    owner_id: UUID
    visibility: str

    class Config:
        from_attributes = True


class WorkspaceMemberCreate(BaseModel):
    user_id: UUID
    role: Optional[str]
    can_create_pages: Optional[str] = "0"
    can_create_blocks: Optional[str] = "0"
    can_invite_members: Optional[str] = "0"

class WorkspaceMemberResponse(BaseModel):
    workspace_id: UUID
    user_id: UUID
    role: str

    class Config:
        from_attributes = True

    class Config:
        from_attributes = True

class InviteUser(BaseModel):
    email: str