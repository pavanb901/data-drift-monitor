import pandas as pd
import numpy as np

NUM_BINS = 6


def generate_profile(csv_path: str):
    df = pd.read_csv(csv_path)
    profiles = []

    for col in df.columns:
        series = df[col].dropna()

        # Numerical features
        if pd.api.types.is_numeric_dtype(series):
            counts, bin_edges = np.histogram(series, bins=NUM_BINS)

            profiles.append({
                "feature_name": col,
                "feature_type": "numerical",
                "stats": {
                    "min": float(series.min()),
                    "max": float(series.max()),
                    "mean": float(series.mean()),
                    "std": float(series.std()),
                    "histogram": {
                        "bins": bin_edges.tolist(),
                        "counts": counts.tolist()
                    }
                }
            })

        # Categorical features
        else:
            value_counts = series.value_counts()

            profiles.append({
                "feature_name": col,
                "feature_type": "categorical",
                "stats": {
                    "counts": value_counts.to_dict()
                }
            })

    return profiles