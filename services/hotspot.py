import numpy as np
import hdbscan
from sklearn.metrics import silhouette_score, davies_bouldin_score, calinski_harabasz_score

def detect_hotspots_with_metrics(df):
    """Detect hotspots using HDBSCAN clustering and compute metrics."""
    
    features = df[["latitude", "longitude"]].values
    
    # Increase min_cluster_size to reduce fragmentation and create more meaningful hotspots
    clusterer = hdbscan.HDBSCAN(min_cluster_size=25, min_samples=10)
    labels = clusterer.fit_predict(features)
    
    df["cluster_id"] = labels
    
    # Compute clustering metrics
    n_clusters = len(set(labels)) - (1 if -1 in labels else 0)
    n_noise = list(labels).count(-1)
    n_total = len(labels)
    
    metrics = {
        "n_clusters": n_clusters,
        "n_noise_points": n_noise,
        "n_total_points": n_total,
        "noise_percent": round(100 * n_noise / n_total, 2) if n_total > 0 else 0,
        "avg_cluster_size": round((n_total - n_noise) / n_clusters, 1) if n_clusters > 0 else 0
    }
    
    # Silhouette score only if we have at least 2 clusters and some non-noise points
    if n_clusters > 1 and n_noise < n_total:
        non_noise_mask = labels != -1
        if non_noise_mask.sum() > 0:
            try:
                silhouette = silhouette_score(
                    features[non_noise_mask],
                    labels[non_noise_mask]
                )
                metrics["silhouette_score"] = round(float(silhouette), 4)
            except:
                metrics["silhouette_score"] = None
    else:
        metrics["silhouette_score"] = None
    
    # Davies-Bouldin Index (lower is better)
    if n_clusters > 1 and n_noise < n_total:
        non_noise_mask = labels != -1
        if non_noise_mask.sum() > 0:
            try:
                db_index = davies_bouldin_score(
                    features[non_noise_mask],
                    labels[non_noise_mask]
                )
                metrics["davies_bouldin_index"] = round(float(db_index), 4)
            except:
                metrics["davies_bouldin_index"] = None
    else:
        metrics["davies_bouldin_index"] = None
    
    # Calinski-Harabasz Index (higher is better)
    if n_clusters > 1 and n_noise < n_total:
        non_noise_mask = labels != -1
        if non_noise_mask.sum() > 0:
            try:
                ch_index = calinski_harabasz_score(
                    features[non_noise_mask],
                    labels[non_noise_mask]
                )
                metrics["calinski_harabasz_index"] = round(float(ch_index), 2)
            except:
                metrics["calinski_harabasz_index"] = None
    else:
        metrics["calinski_harabasz_index"] = None
    
    return df, metrics


def detect_hotspots(df):
    """Legacy function for backward compatibility."""
    df, _ = detect_hotspots_with_metrics(df)
    return df