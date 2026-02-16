import os
import shutil
from datetime import datetime
from sqlalchemy.orm import Session

from backend.app.models.dataset import Dataset

UPLOAD_DIR = "backend/data/uploads"


def save_dataset(
    db: Session,
    dataset_name: str,
    file,
    is_baseline: bool
) -> Dataset:
    """
    Saves CSV file to disk and registers dataset in DB.
    """

    os.makedirs(UPLOAD_DIR, exist_ok=True)

    version = datetime.utcnow().strftime("v%Y%m%d%H%M%S")
    filename = f"{dataset_name}_{version}.csv"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    if is_baseline:
        db.query(Dataset).filter(
            Dataset.dataset_name == dataset_name,
            Dataset.is_baseline == True
        ).update({"is_baseline": False})

    dataset = Dataset(
        dataset_name=dataset_name,
        version=version,
        file_path=file_path,
        is_baseline=is_baseline
    )

    db.add(dataset)
    db.commit()
    db.refresh(dataset)

    return dataset

def clear_upload_directory():
    """
    Deletes all files and subdirectories inside the UPLOAD_DIR.
    """
    for filename in os.listdir(UPLOAD_DIR):
        file_path = os.path.join(UPLOAD_DIR, filename)
        try:
            if os.path.isfile(file_path) or os.path.is_link(file_path):
                os.unlink(file_path)  # Deletes files or links
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path) # Deletes subdirectories
        except Exception as e:
            print(f'Failed to delete {file_path}. Reason: {e}')