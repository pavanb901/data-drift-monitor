from fastapi import APIRouter, UploadFile, File, Form, Depends
from sqlalchemy.orm import Session

from backend.app.database import SessionLocal
from backend.app.services.ingestion import save_dataset
from backend.app.services.ingestion import clear_upload_directory
from backend.app.models.dataset import Dataset
from backend.app.models.drift import DriftResult

router = APIRouter(prefix="/datasets", tags=["Datasets"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/upload")
def upload_dataset(
    dataset_name: str = Form(...),
    is_baseline: bool = Form(False),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    dataset = save_dataset(
        db=db,
        dataset_name=dataset_name,
        file=file,
        is_baseline=is_baseline
    )

    return {
        "dataset_id": dataset.id,
        "dataset_name": dataset.dataset_name,
        "version": dataset.version,
        "is_baseline": dataset.is_baseline
    }


@router.delete("/clear")
def clear_datasets(db: Session = Depends(get_db)):
    db.query(Dataset).delete()
    db.commit()
    clear_upload_directory()
    return {"message": "All datasets cleared"}

@router.get("/{dataset_name}/drift-history")
def get_drift_history(dataset_name: str, db: Session = Depends(get_db)):
    datasets = (
        db.query(Dataset)
        .filter(Dataset.dataset_name == dataset_name)
        .order_by(Dataset.created_at)
        .all()
    )

    history = []

    for ds in datasets:
        drifts = (
            db.query(DriftResult)
            .filter(DriftResult.current_dataset_id == ds.id)
            .all()
        )

        for d in drifts:
            history.append({
    "version": ds.version,
    "timestamp": ds.created_at.isoformat(),
    "feature": d.feature_name,
    "metric": d.metric_name,
    "value": d.metric_value,
    "severity": d.severity,
    "drift_detected": d.drift_detected,
})

    return history