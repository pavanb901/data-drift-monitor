from backend.app.database import engine, Base
from backend.app.models import dataset, profile, drift, health, explanation

Base.metadata.create_all(bind=engine)
print("Database tables created successfully.")