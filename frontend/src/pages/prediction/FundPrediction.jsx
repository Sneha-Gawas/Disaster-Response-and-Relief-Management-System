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

function FundPrediction() {

    const [form,
        setForm] =
        useState({

            magnitude: "",

            affected_population: "",

            property_damage: "",

            crop_damage: "",

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

                "http://localhost:8000/fund_prediction",

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
                    Relief Fund Prediction
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
                            label="Crop Damage"
                            fullWidth
                            onChange={(e)=>
                            setForm({
                                ...form,
                                crop_damage:
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
                    Predict Fund
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

                                Required Relief Fund:

                                ₹{
                                    result.required_relief_fund
                                }

                            </Typography>

                        </Paper>
                    )
                }

            </Paper>

        </Container>
    );
}

export default FundPrediction;