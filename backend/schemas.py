
from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, EmailStr
from typing import List
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
    full_name: str | None = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    display_name: str | None = None
    bio: str | None = None

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    display_name: str | None = None
    bio: str | None = None

    class Config:
        from_attributes = True

class WorkspaceBase(BaseModel):
    id: str
    name: str
    type: str
    content: str | None = ""
    todos: list | None = []
    createdAt: str
    deleted: bool | None = False

class WorkspaceCreate(WorkspaceBase):
    pass

class WorkspaceUpdate(BaseModel):
    name: str | None = None
    type: str | None = None
    content: str | None = None
    todos: list | None = None
    deleted: bool | None = None

class WorkspaceFavoriteUpdate(BaseModel):
    is_favorite: bool

class WorkspaceResponse(WorkspaceBase):
    user_id: int
    role: str | None = "owner"
    is_favorite: bool | None = False

    class Config:
        from_attributes = True

class InviteUser(BaseModel):
    email: str

class EventBase(BaseModel):
    title: str
    description: str | None = None
    start_time: str # ISO string
    end_time: str   # ISO string
    all_day: bool | None = False
    color: str | None = None

class EventCreate(EventBase):
    pass

class EventUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    start_time: str | None = None
    end_time: str | None = None
    all_day: bool | None = None
    color: str | None = None

class EventResponse(EventBase):
    id: int
    user_id: int
    created_at: str

    class Config:
        from_attributes = True
