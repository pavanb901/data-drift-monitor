from sqlalchemy import Column, Integer, String, ForeignKey
from backend.app.database import Base


class HealthScore(Base):
    __tablename__ = "health_scores"

    id = Column(Integer, primary_key=True, index=True)
    dataset_id = Column(Integer, ForeignKey("datasets.id"))
    score = Column(Integer)
    status = Column(String)