from fastapi import APIRouter

router = APIRouter()

@router.get("/profile")
def get_user_profile():
    return {"user": "Sample User"}