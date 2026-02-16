import pandas as pd
import numpy as np
from scipy.stats import ks_2samp, chisquare
from scipy.spatial.distance import jensenshannon


def severity_from_threshold(value, low, high, reverse=False):
    if reverse:
        if value < high:
            return "high"
        elif value < low:
            return "medium"
        return "low"
    else:
        if value > high:
            return "high"
        elif value > low:
            return "medium"
        return "low"


def numerical_drift(baseline: pd.Series, current: pd.Series) -> list:
    baseline = baseline.dropna()
    current = current.dropna()

    ks_stat, ks_p = ks_2samp(baseline, current)
    wasserstein = np.abs(baseline.mean() - current.mean())

    return [
        {
            "metric": "ks_p_value",
            "value": ks_p,
            "severity": severity_from_threshold(ks_p, 0.1, 0.05, reverse=True)
        },
        {
            "metric": "wasserstein_distance",
            "value": wasserstein,
            "severity": severity_from_threshold(wasserstein, 0.1, 0.3)
        }
    ]


def categorical_drift(baseline: pd.Series, current: pd.Series) -> list:
    baseline_dist = baseline.value_counts(normalize=True)
    current_dist = current.value_counts(normalize=True)

    all_categories = baseline_dist.index.union(current_dist.index)
    baseline_probs = baseline_dist.reindex(all_categories, fill_value=0)
    current_probs = current_dist.reindex(all_categories, fill_value=0)

    js = jensenshannon(baseline_probs, current_probs)

    return [{
        "metric": "js_divergence",
        "value": float(js),
        "severity": severity_from_threshold(js, 0.05, 0.15)
    }]


def detect_drift(baseline_df: pd.DataFrame, current_df: pd.DataFrame) -> list:
    drift_results = []

    baseline_cols = set(baseline_df.columns)
    current_cols = set(current_df.columns)

    # Schema drift
    for col in baseline_cols - current_cols:
        drift_results.append({
            "feature": col,
            "metric": "missing_column",
            "value": None,
            "severity": "high",
            "drift_detected": True
        })

    for col in current_cols - baseline_cols:
        drift_results.append({
            "feature": col,
            "metric": "new_column",
            "value": None,
            "severity": "medium",
            "drift_detected": True
        })

    # Feature drift
    for col in baseline_cols & current_cols:
        base_series = baseline_df[col]
        curr_series = current_df[col]

        if pd.api.types.is_numeric_dtype(base_series):
            metrics = numerical_drift(base_series, curr_series)
        else:
            metrics = categorical_drift(base_series, curr_series)

        for m in metrics:
            drift_results.append({
                "feature": col,
                "metric": m["metric"],
                "value": m["value"],
                "severity": m["severity"],
                "drift_detected": m["severity"] != "low"
            })

    return drift_results