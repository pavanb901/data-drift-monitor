from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.database import SessionLocal
from backend.app.models.drift import DriftResult
from backend.app.models.health import HealthScore
from backend.app.services.health_score import compute_health_score

router = APIRouter(prefix="/datasets", tags=["Health"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/{dataset_id}/health")
def compute_health(dataset_id: int, db: Session = Depends(get_db)):
    drift_results = db.query(DriftResult).filter(
        DriftResult.current_dataset_id == dataset_id
    ).all()

    drift_dicts = [{
        "severity": d.severity
    } for d in drift_results]

    health = compute_health_score(drift_dicts)

    db.query(HealthScore).filter(
        HealthScore.dataset_id == dataset_id
    ).delete()

    db.add(HealthScore(
        dataset_id=dataset_id,
        score=health["score"],
        status=health["status"]
    ))

    db.commit()
    return health