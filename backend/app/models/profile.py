from sqlalchemy import Column, Integer, String, ForeignKey, JSON
from backend.app.database import Base


class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    dataset_id = Column(Integer, ForeignKey("datasets.id"))
    feature_name = Column(String)
    feature_type = Column(String)
    stats_json = Column(JSON)