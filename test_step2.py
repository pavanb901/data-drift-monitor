import pandas as pd

from backend.app.services.profiling import generate_profile
from backend.app.services.drift_detection import detect_drift
from backend.app.services.health_score import compute_health_score
from backend.app.services.explanation_engine import generate_explanation


print("\n--- PROFILING ---")
profiles = generate_profile("baseline.csv")
for p in profiles:
    print(p)

print("\n--- DRIFT DETECTION ---")
baseline_df = pd.read_csv("baseline.csv")
current_df = pd.read_csv("current.csv")

drift_results = detect_drift(baseline_df, current_df)
for d in drift_results:
    print(d)

print("\n--- HEALTH SCORE ---")
health = compute_health_score(drift_results)
print(health)

print("\n--- EXPLANATION ---")
explanation = generate_explanation(drift_results, health)
print(explanation)