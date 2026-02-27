
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import Notification, Invite
from schemas import NotificationResponse, NotificationCreate, InviteResponse, InviteCreate
from deps import get_db, get_current_user

router = APIRouter(prefix="/api/inbox", tags=["inbox"])

# Notifications endpoints
@router.get("/notifications", response_model=list[NotificationResponse])
def list_notifications(user=Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Notification).filter(Notification.user_id == user.id).order_by(Notification.created_at.desc()).all()

@router.post("/notifications", response_model=NotificationResponse)
def create_notification(notification: NotificationCreate, user=Depends(get_current_user), db: Session = Depends(get_db)):
    notif = Notification(**notification.dict(), user_id=user.id)
    db.add(notif)
    db.commit()
    db.refresh(notif)
    return notif

@router.put("/notifications/{notification_id}/read", response_model=NotificationResponse)
def mark_notification_read(notification_id: str, user=Depends(get_current_user), db: Session = Depends(get_db)):
    notif = db.query(Notification).filter(Notification.id == notification_id, Notification.user_id == user.id).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    notif.is_read = True
    db.commit()
    db.refresh(notif)
    return notif

# Invites endpoints
@router.get("/invites", response_model=list[InviteResponse])
def list_invites(user=Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Invite).filter(Invite.user_id == user.id).order_by(Invite.created_at.desc()).all()

@router.post("/invites", response_model=InviteResponse)
def create_invite(invite: InviteCreate, user=Depends(get_current_user), db: Session = Depends(get_db)):
    inv = Invite(**invite.dict(), sender_id=user.id, user_id=invite.user_id)
    db.add(inv)
    db.commit()
    db.refresh(inv)
    return inv

@router.put("/invites/{invite_id}/status", response_model=InviteResponse)
def update_invite_status(invite_id: str, status: str, user=Depends(get_current_user), db: Session = Depends(get_db)):
    inv = db.query(Invite).filter(Invite.id == invite_id, Invite.user_id == user.id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Invite not found")
    inv.status = status
    db.commit()
    db.refresh(inv)
    return inv
