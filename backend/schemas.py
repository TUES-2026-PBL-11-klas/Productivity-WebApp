
from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, EmailStr
from typing import List, Optional

# User Settings
class UserSettingsResponse(BaseModel):
    user_id: UUID
    theme: str
    language: str
    notifications_enabled: bool
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

# Notifications
class NotificationResponse(BaseModel):
    id: UUID
    user_id: UUID
    type: str
    content: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True

class NotificationCreate(BaseModel):
    type: str
    content: str

# Invites
class InviteResponse(BaseModel):
    id: UUID
    user_id: UUID
    workspace_id: Optional[UUID]
    event_id: Optional[UUID]
    sender_id: Optional[UUID]
    type: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class InviteCreate(BaseModel):
    workspace_id: Optional[UUID]
    event_id: Optional[UUID]
    type: str  # 'workspace' or 'event'


# Trash
class TrashItemCreate(BaseModel):
    item_type: str
    item_id: str

class TrashItemResponse(BaseModel):
    id: str
    user_id: UUID
    item_type: str
    item_id: str
    deleted_at: datetime

    class Config:
        from_attributes = True


class UserSettingsUpdate(BaseModel):
    theme: Optional[str] = None  # 'light' or 'dark'
    language: Optional[str] = None  # 'bg' or 'en'
    notifications_enabled: Optional[bool] = None

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