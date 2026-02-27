from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import UserSettings
from schemas import UserSettingsUpdate, UserSettingsResponse
from deps import get_db, get_current_user

router = APIRouter(prefix="/api/settings", tags=["settings"])

@router.get("/", response_model=UserSettingsResponse)
def get_settings(user=Depends(get_current_user), db: Session = Depends(get_db)):
    settings = db.query(UserSettings).filter(UserSettings.user_id == user.id).first()
    if not settings:
        raise HTTPException(status_code=404, detail="Settings not found")
    return settings

@router.put("/", response_model=UserSettingsResponse)
def update_settings(update: UserSettingsUpdate, user=Depends(get_current_user), db: Session = Depends(get_db)):
    settings = db.query(UserSettings).filter(UserSettings.user_id == user.id).first()
    if not settings:
        raise HTTPException(status_code=404, detail="Settings not found")
    for k, v in update.dict(exclude_unset=True).items():
        setattr(settings, k, v)
    db.commit()
    db.refresh(settings)
    return settings
