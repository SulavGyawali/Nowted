import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Response, Header
from sqlalchemy.orm import Session
from ..database import get_db, get_mongo_db
from ..models import User
from ..schemas import Login, Token, TokenVerify
from ..utils import verify_password
from ..oauth2 import create_access_token, refresh_access_token, create_refresh_token, verify_access_token_time
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

router = APIRouter(
    prefix='/auth',
    tags=['auth']
)


async def log_auth_event(mongo_db, event: str, email: str = None, user_id: int = None, extra: dict = None):
    try:
        doc = {
            "event": event,
            "email": email,
            "user_id": user_id,
            "at": datetime.datetime.utcnow(),
        }
        if extra:
            doc.update(extra)
        await mongo_db["auth_events"].insert_one(doc)
    except Exception as e:
        print(f"[auth event] mongo log failed: {e}")


@router.post('/login', response_model=Token)
async def login(
    user_creds: Login,
    db: Session = Depends(get_db),
    mongo_db = Depends(get_mongo_db),
):
    user = db.query(User).filter(User.email == user_creds.email).first()

    if user is None:
        await log_auth_event(mongo_db, "login_failed", email=user_creds.email, extra={"reason": "no_such_user"})
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid credentials")

    if not verify_password(user_creds.password, user.password):
        await log_auth_event(mongo_db, "login_failed", email=user_creds.email, user_id=user.id, extra={"reason": "wrong_password"})
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid credentials")

    access_token = create_access_token(data={"sub": user.email})
    refresh_token = create_refresh_token(data={"sub": user.email})

    await log_auth_event(mongo_db, "login_success", email=user.email, user_id=user.id)

    response = {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }
    return response


@router.get('/refresh-token', response_model=Token)
async def refresh_token(token: str = Depends(oauth2_scheme), authorization: str = Header(...)):
    if not token:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Token not provided")
    new_token = refresh_access_token(token)
    if not new_token:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid token")
    return {"access_token": new_token, "refresh_token": token, "token_type": "bearer"}


@router.get('/verify-token', response_model=TokenVerify)
async def verify_token(token: str = Depends(oauth2_scheme)):
    if not token:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Token not provided")
    verification_result = verify_access_token_time(token)
    print(verification_result)
    if not verification_result["valid"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=verification_result["reason"])
    return {"valid": True}


@router.post('/logout')
async def logout(response: Response, mongo_db = Depends(get_mongo_db)):
    response.delete_cookie(key="Authorization")
    await log_auth_event(mongo_db, "logout")
    return {"message": "Logged out successfully"}