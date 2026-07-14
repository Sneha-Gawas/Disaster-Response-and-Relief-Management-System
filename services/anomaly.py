import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest

def detect_anomalies_with_metrics(df):

    news = df.copy()

    news["disaster_type"] = news.get("disaster_type", news.get("incidentType", "Unknown Disaster")).fillna("Unknown Disaster")
    news["state"] = news["state"].fillna("Unknown")
    news["county"] = news.get("county", news.get("designatedArea", "Unknown")).fillna("Unknown")
    news["incident_date"] = pd.to_datetime(news.get("incident_date", news.get("incidentBeginDate")), errors="coerce")
    if news["incident_date"].dt.tz is not None:
        news["incident_date"] = news["incident_date"].dt.tz_convert("UTC").dt.tz_localize(None)

    news["days_since"] = (pd.Timestamp.now() - news["incident_date"]).dt.days
    if news["days_since"].isna().all():
        news["days_since"] = 0
    else:
        news["days_since"] = news["days_since"].fillna(news["days_since"].max())

    news["type_count"] = news["disaster_type"].map(news["disaster_type"].value_counts())
    news["state_count"] = news["state"].map(news["state"].value_counts())

    features = news[["type_count", "state_count", "days_since"]].fillna(0)

    model = IsolationForest(
        contamination=0.05,
        random_state=42
    )

    preds = model.fit_predict(features)
    news["anomaly"] = preds == -1

    scores = model.decision_function(features)
    anomaly_rate = float(np.mean(news["anomaly"])) * 100
    anomaly_count = int(news["anomaly"].sum())

    metrics = {
        "model": "IsolationForest",
        "contamination": 0.05,
        "total_records": len(news),
        "anomaly_count": anomaly_count,
        "anomaly_rate_percent": round(anomaly_rate, 2),
        "mean_decision_score": round(float(np.mean(scores)), 4),
        "mean_score_anomaly": round(float(np.mean(scores[news["anomaly"]])), 4) if anomaly_count > 0 else None,
        "mean_score_normal": round(float(np.mean(scores[~news["anomaly"]])), 4) if anomaly_count < len(news) else None,
        "score_threshold": round(float(np.percentile(scores, 5)), 4),
        "note": "Lower decision scores indicate stronger anomaly signal."
    }

    return news, metrics


def detect_anomalies(df):
    news, _ = detect_anomalies_with_metrics(df)
    return news