from sqlalchemy import Column, Integer, String, Text, ForeignKey
from backend.app.database import Base


class Explanation(Base):
    __tablename__ = "explanations"

    id = Column(Integer, primary_key=True, index=True)
    dataset_id = Column(Integer, ForeignKey("datasets.id"))
    explanation_text = Column(Text)
    recommendation = Column(String)