from fastapi import APIRouter, Depends, File, UploadFile

from app.cloudinary_client import upload_file
from app.security import require_admin

router = APIRouter(prefix="/api/admin/media", tags=["media"])


@router.post("/upload", dependencies=[Depends(require_admin)])
async def upload_media(file: UploadFile = File(...)):
    contents = await file.read()
    resource_type = "auto"
    url = upload_file(contents, folder="portfolio", resource_type=resource_type)
    return {"url": url}
