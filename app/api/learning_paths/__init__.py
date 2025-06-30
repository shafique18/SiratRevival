from fastapi import APIRouter

router = APIRouter()

@router.get("/paths")
def get_learning_paths():
    return ["Beginner Path", "Scholar Path"]