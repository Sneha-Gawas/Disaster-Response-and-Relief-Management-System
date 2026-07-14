import { useEffect, useState } from "react";
import axios from "axios";
import {
    Box,
    Paper,
    Grid,
    Card,
    CardContent,
    Typography,
    Chip,
    Divider
} from "@mui/material";

function Anomalies() {
    const [data, setData] = useState([]);
    const [metadata, setMetadata] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:8000/anomalies").then(res => {
            setData(res.data.news || []);
            setMetadata({
                source: res.data.source,
                total_records: res.data.total_records,
                anomaly_metrics: res.data.anomaly_metrics
            });
        });
    }, []);

    const summaryCards = metadata
        ? [
              {
                  title: "Total Records",
                  value: metadata.total_records ?? "—",
                  description: "Total disaster news records retrieved."
              },
              {
                  title: "Anomaly Count",
                  value: metadata.anomaly_metrics?.anomaly_count ?? "—",
                  description: "Records marked as anomalies."
              },
              {
                  title: "Anomaly Rate",
                  value:
                      metadata.anomaly_metrics?.anomaly_rate_percent != null
                          ? `${metadata.anomaly_metrics.anomaly_rate_percent}%`
                          : "—",
                  description: "Proportion of anomalies in the dataset."
              }
          ]
        : [];

    return (
        <Box sx={{ width: "100%", py: 3 }}>
            <Paper sx={{ p: 3, borderRadius: 3, bgcolor: "background.default" }} elevation={1}>
                <Typography variant="h4" gutterBottom>
                    Disaster News Aggregation
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                    A consolidated view of disaster-related news items, anomaly detection results, and metadata from the latest FEMA disaster declarations feed.
                </Typography>

                {metadata && (
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        {summaryCards.map(card => (
                            <Grid item xs={12} sm={4} key={card.title}>
                                <Card sx={{ minHeight: 140, borderRadius: 2, boxShadow: 1 }}>
                                    <CardContent>
                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                            {card.title}
                                        </Typography>
                                        <Typography variant="h5" sx={{ mb: 1 }}>
                                            {card.value}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {card.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {metadata && (
                    <Card sx={{ mb: 3, borderRadius: 2, bgcolor: "grey.50" }}>
                        <CardContent>
                            <Typography variant="subtitle1" gutterBottom>
                                Source Details
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        Source
                                    </Typography>
                                    <Typography variant="body1">
                                        {metadata.source || "Unknown source"}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        Detection Model
                                    </Typography>
                                    <Typography variant="body1">
                                        {metadata.anomaly_metrics?.model || "Unknown"}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                )}

                <Grid container spacing={2}>
                    {data.length > 0 ? (
                        data.map((row, index) => (
                            <Grid item xs={12} md={6} key={index}>
                                <Card sx={{ minHeight: 220, borderRadius: 3, boxShadow: 1 }}>
                                    <CardContent>
                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                {row.headline || "Untitled"}
                                            </Typography>
                                            <Chip
                                                label={row.anomaly ? "Anomaly" : "Normal"}
                                                color={row.anomaly ? "error" : "success"}
                                                size="small"
                                            />
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" paragraph sx={{ minHeight: 60 }}>
                                            {row.summary || "No summary available."}
                                        </Typography>
                                        <Grid container spacing={1}>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="caption" color="text.secondary">
                                                    Location
                                                </Typography>
                                                <Typography variant="body2">
                                                    {row.county || "Unknown"}, {row.state || "Unknown"}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="caption" color="text.secondary">
                                                    Date
                                                </Typography>
                                                <Typography variant="body2">
                                                    {row.published_at || "Unknown"}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                        {row.source_url && (
                                            <Typography variant="caption" color="primary" sx={{ mt: 2, display: "block" }}>
                                                <a href={row.source_url} target="_blank" rel="noreferrer" style={{ color: "inherit", textDecoration: "none" }}>
                                                    View source
                                                </a>
                                            </Typography>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Paper sx={{ p: 4, textAlign: "center", bgcolor: "grey.100" }}>
                                <Typography variant="h6">No disaster news items available yet.</Typography>
                                <Typography color="text.secondary">
                                    Check back once the backend service has returned anomaly news records.
                                </Typography>
                            </Paper>
                        </Grid>
                    )}
                </Grid>
            </Paper>
        </Box>
    );
}

export default Anomalies;