from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey
from backend.app.database import Base


class DriftResult(Base):
    __tablename__ = "drift_results"

    id = Column(Integer, primary_key=True, index=True)
    baseline_dataset_id = Column(Integer)
    current_dataset_id = Column(Integer)
    feature_name = Column(String)
    metric_name = Column(String)
    metric_value = Column(Float, nullable=True)
    severity = Column(String)
    drift_detected = Column(Boolean)