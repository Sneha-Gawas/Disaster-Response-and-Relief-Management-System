from fastapi import Depends, Header, HTTPException
from sqlalchemy.orm import Session

from dependencies import get_db
from models import User
from services.jwt_service import decode_access_token


def get_current_user(
    authorization: str | None = Header(default=None),
    db: Session = Depends(get_db),
):
    token = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ", 1)[1]

    if not token:
        raise HTTPException(status_code=401, detail="Authentication required")

    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.id == payload.get("user_id")).first()
    if not user or user.email != payload.get("sub"):
        raise HTTPException(status_code=401, detail="Invalid token")

    return user


def require_roles(*allowed_roles):
    def dependency(current_user: User = Depends(get_current_user)):
        if current_user.role.upper() not in {role.upper() for role in allowed_roles}:
            raise HTTPException(status_code=403, detail="Forbidden")
        return current_user

    return dependency
