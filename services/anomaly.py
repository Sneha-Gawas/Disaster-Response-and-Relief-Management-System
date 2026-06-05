from sklearn.ensemble import IsolationForest

def detect_anomalies(df):

    features = df[
        [
            "magnitude",
            "depth"
        ]
    ]

    model = IsolationForest(
        contamination=0.05,
        random_state=42
    )

    preds = model.fit_predict(features)

    df["anomaly"] = preds

    return df