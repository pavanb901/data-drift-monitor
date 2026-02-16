def generate_explanation(drift_results: list, health: dict) -> dict:
    high_features = {
        d["feature"] for d in drift_results if d["severity"] == "high"
    }

    medium_features = {
        d["feature"] for d in drift_results if d["severity"] == "medium"
    }

    explanation = []

    if high_features:
        explanation.append(
            f"Significant drift detected in features: {', '.join(sorted(high_features))}."
        )

    if medium_features:
        explanation.append(
            f"Moderate drift observed in features: {', '.join(sorted(medium_features))}."
        )

    explanation.append(
        f"Overall data health score is {health['score']} ({health['status']})."
    )

    if health["status"] == "retraining_suggested":
        recommendation = "Retraining suggested"
    elif health["status"] == "monitor":
        recommendation = "Monitor closely"
    else:
        recommendation = "Safe to use"

    explanation.append(f"Recommendation: {recommendation}.")

    return {
        "explanation_text": " ".join(explanation),
        "recommendation": recommendation
    }