from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime
from backend.app.database import Base

class Dataset(Base):
    __tablename__ = "datasets"

    id = Column(Integer, primary_key=True, index=True)
    dataset_name = Column(String, index=True)
    version = Column(String, index=True)

    file_path = Column(String)          # 🔴 THIS WAS MISSING
    is_baseline = Column(Boolean, default=False)

    created_at = Column(DateTime, default=datetime.now)