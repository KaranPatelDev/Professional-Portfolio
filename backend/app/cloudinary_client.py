import cloudinary
import cloudinary.uploader

from app.config import settings

cloudinary.config(
    cloud_name=settings.cloudinary_cloud_name,
    api_key=settings.cloudinary_api_key,
    api_secret=settings.cloudinary_api_secret,
    secure=True,
)


def upload_file(file_bytes: bytes, folder: str, resource_type: str = "auto", format: str | None = None) -> str:
    kwargs = {"folder": folder, "resource_type": resource_type}
    if format:
        # Explicit format so Cloudinary tracks the correct file extension —
        # otherwise "raw" uploads get an extension-less public_id and the
        # downloaded file loses its .pdf association.
        kwargs["format"] = format
    result = cloudinary.uploader.upload(file_bytes, **kwargs)
    return result["secure_url"]
