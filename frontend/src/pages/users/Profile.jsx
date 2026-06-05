import {
    Container,
    Paper,
    Typography,
    Avatar,
    Grid
} from "@mui/material";

function Profile() {

    const user = {

        full_name:
            "Disaster Manager",

        email:
            "admin@disaster.com",

        role:
            "ADMIN"
    };

    return (

        <Container>

            <Paper
                sx={{
                    p: 4
                }}
            >

                <Grid
                    container
                    spacing={3}
                >

                    <Grid item>

                        <Avatar
                            sx={{
                                width: 100,
                                height: 100
                            }}
                        >
                            D
                        </Avatar>

                    </Grid>

                    <Grid item>

                        <Typography
                            variant="h4"
                        >
                            {user.full_name}
                        </Typography>

                        <Typography>
                            {user.email}
                        </Typography>

                        <Typography>
                            Role:
                            {user.role}
                        </Typography>

                    </Grid>

                </Grid>

            </Paper>

        </Container>
    );
}

export default Profile;