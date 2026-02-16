def compute_health_score(drift_results: list) -> dict:
    high = sum(1 for d in drift_results if d["severity"] == "high")
    medium = sum(1 for d in drift_results if d["severity"] == "medium")

    score = 100 - (high * 15) - (medium * 7)
    score = max(score, 0)

    if score >= 80:
        status = "safe"
    elif score >= 50:
        status = "monitor"
    else:
        status = "retraining_suggested"

    return {
        "score": score,
        "status": status
    }