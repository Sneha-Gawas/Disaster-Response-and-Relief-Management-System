import {
    useState
} from "react";

import axios from "axios";

import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Grid
} from "@mui/material";

function ResourcePrediction() {

    const [form, setForm] =
        useState({

            magnitude: "",

            affected_population: "",

            property_damage: "",

            injuries: "",

            deaths: ""
        });

    const [result,
        setResult] =
        useState(null);

    const predict =
        async () => {

        const response =
            await axios.get(

                "http://localhost:8000/resource_prediction",

                {
                    params: form
                }
            );

        setResult(
            response.data
        );
    };

    return (

        <Container>

            <Paper sx={{p:3}}>

                <Typography
                    variant="h5"
                >
                    Resource Prediction
                </Typography>

                <Grid
                    container
                    spacing={2}
                    mt={1}
                >

                    <Grid item xs={12}>
                        <TextField
                            label="Magnitude"
                            fullWidth
                            onChange={(e)=>
                            setForm({
                                ...form,
                                magnitude:
                                e.target.value
                            })}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="Affected Population"
                            fullWidth
                            onChange={(e)=>
                            setForm({
                                ...form,
                                affected_population:
                                e.target.value
                            })}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="Property Damage"
                            fullWidth
                            onChange={(e)=>
                            setForm({
                                ...form,
                                property_damage:
                                e.target.value
                            })}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="Injuries"
                            fullWidth
                            onChange={(e)=>
                            setForm({
                                ...form,
                                injuries:
                                e.target.value
                            })}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="Deaths"
                            fullWidth
                            onChange={(e)=>
                            setForm({
                                ...form,
                                deaths:
                                e.target.value
                            })}
                        />
                    </Grid>

                </Grid>

                <Button
                    variant="contained"
                    sx={{mt:3}}
                    onClick={predict}
                >
                    Predict Resources
                </Button>

                {

                    result && (

                        <Paper
                            sx={{
                                mt:3,
                                p:2
                            }}
                        >

                            <Typography>
                                Food Kits:
                                {result.food_kits}
                            </Typography>

                            <Typography>
                                Medical Kits:
                                {result.medical_kits}
                            </Typography>

                            <Typography>
                                Shelters:
                                {result.shelters_required}
                            </Typography>

                            <Typography>
                                Rescue Teams:
                                {result.rescue_teams}
                            </Typography>

                            <Typography>
                                Water Units:
                                {result.water_units}
                            </Typography>

                        </Paper>
                    )
                }

            </Paper>

        </Container>
    );
}

export default ResourcePrediction;