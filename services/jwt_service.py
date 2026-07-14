import os
from datetime import datetime, timedelta, timezone
import jwt

SECRET_KEY = os.getenv("JWT_SECRET", "disaster-secret-key")
ALGORITHM = "HS256"


def create_access_token(user):
    payload = {
        "sub": user.email,
        "user_id": user.id,
        "role": user.role,
        "exp": datetime.now(timezone.utc) + timedelta(hours=8),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token):
    if not token:
        return None
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except Exception:
        return None
