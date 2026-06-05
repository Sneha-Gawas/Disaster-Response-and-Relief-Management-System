import {
    Grid,
    Typography,
    Box
} from "@mui/material";

import {
    useEffect,
    useState
} from "react";

import axios from "axios";

import StatsCard from
"../../components/dashboard/StatsCard";

import DisasterChart from
"../../components/dashboard/DisasterChart";

function Dashboard() {

    const [

        earthquakeCount,

        setEarthquakeCount

    ] = useState(0);

    const [

        hotspotCount,

        setHotspotCount

    ] = useState(0);

    const [

        anomalyCount,

        setAnomalyCount

    ] = useState(0);

    useEffect(() => {

        loadData();

    }, []);

    const loadData =
    async () => {

        try {

            const eq =
            await axios.get(
                "http://localhost:8000/earthquakes"
            );

            const hs =
            await axios.get(
                "http://localhost:8000/hotspots"
            );

            const an =
            await axios.get(
                "http://localhost:8000/anomalies"
            );

            setEarthquakeCount(
                eq.data.length
            );

            setHotspotCount(
                hs.data.length
            );

            setAnomalyCount(
                an.data.length
            );

        } catch (

            error

        ) {

            console.log(
                error
            );
        }
    };

    return (

        <Box p={3}>

            <Typography
                variant="h4"
                gutterBottom
            >

                Disaster Dashboard

            </Typography>

            <Grid
                container
                spacing={3}
            >

                <Grid item>

                    <StatsCard
                        title=
                        "Earthquakes"

                        value=
                        {earthquakeCount}
                    />

                </Grid>

                <Grid item>

                    <StatsCard
                        title=
                        "Hotspots"

                        value=
                        {hotspotCount}
                    />

                </Grid>

                <Grid item>

                    <StatsCard
                        title=
                        "Anomalies"

                        value=
                        {anomalyCount}
                    />

                </Grid>

            </Grid>

            <Box mt={5}>

                <DisasterChart

                    earthquakes=
                    {earthquakeCount}

                    hotspots=
                    {hotspotCount}

                    anomalies=
                    {anomalyCount}

                />

            </Box>

        </Box>
    );
}

export default Dashboard;