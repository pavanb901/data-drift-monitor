import pandas as pd
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.database import SessionLocal
from backend.app.models.dataset import Dataset
from backend.app.models.profile import Profile
from backend.app.services.profiling import generate_profile

router = APIRouter(prefix="/datasets", tags=["Profiling"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/{dataset_id}/profile")
def run_profiling(dataset_id: int, db: Session = Depends(get_db)):
    dataset = db.query(Dataset).get(dataset_id)
    profiles = generate_profile(dataset.file_path)

    db.query(Profile).filter(Profile.dataset_id == dataset_id).delete()

    for p in profiles:
        db.add(Profile(
            dataset_id=dataset_id,
            feature_name=p["feature_name"],
            feature_type=p["feature_type"],
            stats_json=p["stats"]
        ))

    db.commit()
    return profiles