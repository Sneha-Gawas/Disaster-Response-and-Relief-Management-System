import hdbscan

def detect_hotspots(df):

    features = df[
        [
            "latitude",
            "longitude"
        ]
    ]

    clusterer = hdbscan.HDBSCAN(
        min_cluster_size=5
    )

    labels = clusterer.fit_predict(features)

    df["cluster_id"] = labels

    return df