from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.database import SessionLocal
from backend.app.models.drift import DriftResult
from backend.app.models.health import HealthScore
from backend.app.models.explanation import Explanation
from backend.app.services.explanation_engine import generate_explanation

router = APIRouter(prefix="/datasets", tags=["Explanation"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/{dataset_id}/explanation")
def explain(dataset_id: int, db: Session = Depends(get_db)):
    drift_results = db.query(DriftResult).filter(
        DriftResult.current_dataset_id == dataset_id
    ).all()

    health = db.query(HealthScore).filter(
        HealthScore.dataset_id == dataset_id
    ).first()

    drift_dicts = [{
        "feature": d.feature_name,
        "severity": d.severity
    } for d in drift_results]

    health_dict = {
        "score": health.score,
        "status": health.status
    }

    explanation = generate_explanation(drift_dicts, health_dict)

    db.query(Explanation).filter(
        Explanation.dataset_id == dataset_id
    ).delete()

    db.add(Explanation(
        dataset_id=dataset_id,
        explanation_text=explanation["explanation_text"],
        recommendation=explanation["recommendation"]
    ))

    db.commit()
    return explanation