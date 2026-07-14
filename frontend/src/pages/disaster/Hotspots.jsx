import {
    useEffect,
    useState
} from "react";

import axios from "axios";

import {
    Paper,
    Table,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
    Typography,
    Grid,
    Card,
    CardContent,
    Box
} from "@mui/material";

function Hotspots() {

    const [data, setData] = useState([]);
    const [plotData, setPlotData] = useState([]);
    const [metrics, setMetrics] = useState(null);
    const [totalRecords, setTotalRecords] = useState(0);

    useEffect(() => {
        axios
            .get("http://localhost:8000/hotspots")
            .then(res => {
                setData(res.data.hotspots_preview || res.data.hotspots || []);
                setPlotData(res.data.hotspots || res.data.hotspots_preview || []);
                setMetrics(res.data.metrics);
                setTotalRecords(res.data.total_records);
            });
    }, []);

    const getClusterColorMap = (points) => {
        const clusterIds = Array.from(
            new Set(points.map(d => d.cluster_id).filter(id => id !== null && id !== undefined))
        );

        const noiseIndex = clusterIds.indexOf(-1);
        if (noiseIndex !== -1) {
            clusterIds.splice(noiseIndex, 1);
            clusterIds.push(-1);
        }

        return clusterIds.reduce((map, clusterId, idx) => {
            map[clusterId] = clusterId === -1
                ? "#888888"
                : `hsl(${(idx * 137.508) % 360}, 68%, 55%)`;
            return map;
        }, {});
    };

    const generateClusterLegend = () => {
        if (!plotData || plotData.length === 0) return null;

        const clusterCounts = plotData.reduce((counts, point) => {
            const id = point.cluster_id ?? -1;
            counts[id] = (counts[id] || 0) + 1;
            return counts;
        }, {});

        const sortedClusters = Object.entries(clusterCounts)
            .sort(([aId, aCount], [bId, bCount]) => {
                if (aId === "-1") return 1;
                if (bId === "-1") return -1;
                return bCount - aCount;
            });

        const colorMap = getClusterColorMap(plotData);
        const legendEntries = sortedClusters.slice(0, 8);

        return (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
                {legendEntries.map(([clusterId, count]) => (
                    <Box
                        key={clusterId}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            px: 1,
                            py: 0.5,
                            bgcolor: "background.paper",
                            border: "1px solid #ddd",
                            borderRadius: 1
                        }}
                    >
                        <Box
                            sx={{
                                width: 14,
                                height: 14,
                                borderRadius: 1,
                                bgcolor: colorMap[Number(clusterId)] || "#888888"
                            }}
                        />
                        <Typography variant="caption">
                            {clusterId === "-1" ? "Noise" : `Cluster ${clusterId}`} · {count}
                        </Typography>
                    </Box>
                ))}
                {sortedClusters.length > 8 && (
                    <Typography variant="caption" sx={{ alignSelf: "center" }}>
                        + {sortedClusters.length - 8} more clusters
                    </Typography>
                )}
            </Box>
        );
    };

    // Generate scatter plot SVG
    const generateScatterPlot = () => {
        if (!plotData || plotData.length === 0) return null;

        const width = 600;
        const height = 400;
        const padding = 40;

        const points = plotData.filter(point =>
            point.latitude !== null &&
            point.longitude !== null &&
            !isNaN(point.latitude) &&
            !isNaN(point.longitude)
        );

        if (points.length === 0) return null;

        const lats = points.map(d => d.latitude);
        const lons = points.map(d => d.longitude);

        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLon = Math.min(...lons);
        const maxLon = Math.max(...lons);

        const latRange = maxLat - minLat || 1;
        const lonRange = maxLon - minLon || 1;

        const scaleX = (value) => {
            return padding + ((value - minLon) / lonRange) * (width - 2 * padding);
        };

        const scaleY = (value) => {
            return height - padding - ((value - minLat) / latRange) * (height - 2 * padding);
        };

        const colorMap = getClusterColorMap(plotData);

        return (
            <svg width={width} height={height} style={{ border: "1px solid #ccc" }}>
                {/* Axes */}
                <line
                    x1={padding}
                    y1={height - padding}
                    x2={width - padding}
                    y2={height - padding}
                    stroke="black"
                    strokeWidth="2"
                />
                <line
                    x1={padding}
                    y1={padding}
                    x2={padding}
                    y2={height - padding}
                    stroke="black"
                    strokeWidth="2"
                />

                {/* Points */}
                {points.map((point, idx) => {
                    const clusterId = point.cluster_id ?? -1;
                    const fill = colorMap[clusterId] || "#888888";
                    return (
                        <circle
                            key={idx}
                            cx={scaleX(point.longitude)}
                            cy={scaleY(point.latitude)}
                            r={clusterId === -1 ? 2.5 : 3.5}
                            fill={fill}
                            opacity={clusterId === -1 ? 0.45 : 0.7}
                            stroke="#fff"
                            strokeWidth={0.3}
                            shapeRendering="geometricPrecision"
                            title={`${point.place} (Cluster: ${point.cluster_id})`}
                        />
                    );
                })}

                {/* Labels */}
                <text x={width / 2} y={height - 5} textAnchor="middle" fontSize="12">
                    Longitude
                </text>
                <text
                    x={15}
                    y={height / 2}
                    textAnchor="middle"
                    fontSize="12"
                    transform={`rotate(-90, 15, ${height / 2})`}
                >
                    Latitude
                </text>
            </svg>
        );
    };

    const clusterLegend = generateClusterLegend();

    const MetricCard = ({ title, value, description }) => (
        <Card sx={{ mb: 2 }}>
            <CardContent>
                <Typography color="textSecondary" gutterBottom>
                    {title}
                </Typography>
                <Typography variant="h6">
                    {value}
                </Typography>
                {description && (
                    <Typography variant="caption" color="textSecondary">
                        {description}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 3 }}>
                Earthquake Hotspots & Clustering Analysis
            </Typography>

            {/* Metrics Section */}
            {metrics && (
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Clustering Metrics
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                            <MetricCard
                                title="Number of Clusters"
                                value={metrics.n_clusters}
                                description="HDBSCAN identified clusters"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <MetricCard
                                title="Total Points"
                                value={metrics.n_total_points}
                                description={`from ${totalRecords} earthquake records`}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <MetricCard
                                title="Noise Points"
                                value={`${metrics.n_noise_points} (${metrics.noise_percent}%)`}
                                description="Unclustered outliers"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <MetricCard
                                title="Avg Cluster Size"
                                value={metrics.avg_cluster_size}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <MetricCard
                                title="Silhouette Score"
                                value={metrics.silhouette_score ?? "N/A"}
                                description="Higher is better (-1 to 1)"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <MetricCard
                                title="Davies-Bouldin Index"
                                value={metrics.davies_bouldin_index ?? "N/A"}
                                description="Lower is better"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <MetricCard
                                title="Calinski-Harabasz Index"
                                value={metrics.calinski_harabasz_index ?? "N/A"}
                                description="Higher is better"
                            />
                        </Grid>
                    </Grid>
                </Box>
            )}

            {/* Scatter Plot */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Geographic Distribution (Scatter Plot)
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center", p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
                    {generateScatterPlot()}
                </Box>
                {clusterLegend}
                <Typography variant="caption" color="textSecondary" sx={{ display: "block", mt: 1 }}>
                    Colors represent clusters. Gray points are noise (unclustered). Legend shows the largest clusters in the view.
                </Typography>
            </Box>

            {/* Data Table */}
            <Typography variant="h6" sx={{ mb: 2 }}>
                Hotspot Data (Top 200)
            </Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Place</TableCell>
                        <TableCell align="right">Latitude</TableCell>
                        <TableCell align="right">Longitude</TableCell>
                        <TableCell align="right">Magnitude</TableCell>
                        <TableCell align="center">Cluster ID</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row, index) => (
                        <TableRow key={index}>
                            <TableCell>{row.place}</TableCell>
                            <TableCell align="right">{row.latitude?.toFixed(2) || "N/A"}</TableCell>
                            <TableCell align="right">{row.longitude?.toFixed(2) || "N/A"}</TableCell>
                            <TableCell align="right">{row.magnitude?.toFixed(2) || "N/A"}</TableCell>
                            <TableCell align="center">
                                <Box
                                    sx={{
                                        display: "inline-block",
                                        px: 1,
                                        py: 0.5,
                                        bgcolor: row.cluster_id === -1 ? "#e0e0e0" : "#e3f2fd",
                                        borderRadius: 1,
                                        fontWeight: "bold"
                                    }}
                                >
                                    {row.cluster_id === -1 ? "Noise" : row.cluster_id}
                                </Box>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
}

export default Hotspots;