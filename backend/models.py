from sqlalchemy import Column, Integer, String, DateTime,ForeignKey
from sqlalchemy.sql import func
from database import Base
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Workspace(Base):
    __tablename__ = "workspaces"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"))

    members = relationship("WorkspaceMember", back_populates="workspace")


class WorkspaceMember(Base):
    __tablename__ = "workspace_members"

    id = Column(Integer, primary_key=True, index=True)
    workspace_id = Column(Integer, ForeignKey("workspaces.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    role = Column(String, default="member")  # owner / member

    workspace = relationship("Workspace", back_populates="members")
    hashed_password = Column(String, nullable=False)
    display_name = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)
    deleted_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)

class UserSettings(Base):
    __tablename__ = "user_settings"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    theme = Column(String, default="light", nullable=False)
    language = Column(String, default="bg", nullable=False)
    notifications_enabled = Column(Boolean, default=True, nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
