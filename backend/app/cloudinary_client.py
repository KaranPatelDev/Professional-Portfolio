import cloudinary
import cloudinary.uploader

from app.config import settings

cloudinary.config(
    cloud_name=settings.cloudinary_cloud_name,
    api_key=settings.cloudinary_api_key,
    api_secret=settings.cloudinary_api_secret,
    secure=True,
)


def upload_file(file_bytes: bytes, folder: str, resource_type: str = "auto") -> str:
    result = cloudinary.uploader.upload(file_bytes, folder=folder, resource_type=resource_type)
    return result["secure_url"]
