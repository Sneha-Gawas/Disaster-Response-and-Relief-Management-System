import {
    useState
} from "react";

import axios from "axios";

import {
    Container,
    Paper,
    Typography,
    Button,
    TextField
} from "@mui/material";

function BlockchainDashboard() {

    const [location,
        setLocation] =
        useState("");

    const [magnitude,
        setMagnitude] =
        useState("");

    const [result,
        setResult] =
        useState(null);

    const register =
    async () => {

        const response =
            await axios.get(

                "http://localhost:8000/register_disaster",

                {
                    params: {

                        location,

                        magnitude
                    }
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

                    Blockchain Disaster Registry

                </Typography>

                <TextField
                    fullWidth
                    sx={{mt:2}}
                    label="Location"
                    onChange={(e)=>
                        setLocation(
                            e.target.value
                        )
                    }
                />

                <TextField
                    fullWidth
                    sx={{mt:2}}
                    label="Magnitude"
                    onChange={(e)=>
                        setMagnitude(
                            e.target.value
                        )
                    }
                />

                <Button
                    sx={{mt:2}}
                    variant="contained"
                    onClick={register}
                >
                    Register Disaster
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

                                Status:

                                {
                                    result.status
                                }

                            </Typography>

                            <Typography>

                                Transaction Hash:

                                {
                                    result.transaction_hash
                                }

                            </Typography>

                        </Paper>
                    )
                }

            </Paper>

        </Container>
    );
}

export default BlockchainDashboard;