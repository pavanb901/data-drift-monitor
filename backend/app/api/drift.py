import pandas as pd
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.database import SessionLocal
from backend.app.models.dataset import Dataset
from backend.app.models.drift import DriftResult
from backend.app.services.drift_detection import detect_drift

router = APIRouter(prefix="/datasets", tags=["Drift"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/{dataset_id}/drift")
def run_drift(dataset_id: int, db: Session = Depends(get_db)):
    current = db.query(Dataset).get(dataset_id)

    baseline = db.query(Dataset).filter(
        Dataset.dataset_name == current.dataset_name,
        Dataset.is_baseline == True
    ).first()

    if not baseline:
        raise HTTPException(400, "Baseline dataset not found")

    base_df = pd.read_csv(baseline.file_path)
    curr_df = pd.read_csv(current.file_path)

    drift_results = detect_drift(base_df, curr_df)

    db.query(DriftResult).filter(
        DriftResult.current_dataset_id == dataset_id
    ).delete()

    for d in drift_results:
        db.add(DriftResult(
            baseline_dataset_id=baseline.id,
            current_dataset_id=dataset_id,
            feature_name=d["feature"],
            metric_name=d["metric"],
            metric_value=d["value"],
            severity=d["severity"],
            drift_detected=d["drift_detected"]
        ))

    db.commit()
    return drift_results