import {
    useEffect,
    useState
} from "react";

import axios from "axios";

import {
    Container,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Typography
} from "@mui/material";

function Volunteers() {

    const [
        volunteers,
        setVolunteers
    ] = useState([]);

    useEffect(() => {

        axios
            .get(
                "http://localhost:8000/volunteers"
            )
            .then(
                res =>
                setVolunteers(
                    res.data
                )
            );

    }, []);

    return (

        <Container>

            <Paper sx={{p:3}}>

                <Typography
                    variant="h5"
                >
                    Volunteers
                </Typography>

                <Table>

                    <TableHead>

                        <TableRow>

                            <TableCell>
                                Name
                            </TableCell>

                            <TableCell>
                                Email
                            </TableCell>

                            <TableCell>
                                Skills
                            </TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {
                            volunteers.map(
                                (
                                    row,
                                    index
                                ) => (

                                <TableRow
                                    key={index}
                                >

                                    <TableCell>
                                        {
                                            row.name
                                        }
                                    </TableCell>

                                    <TableCell>
                                        {
                                            row.email
                                        }
                                    </TableCell>

                                    <TableCell>
                                        {
                                            row.skills
                                        }
                                    </TableCell>

                                </TableRow>
                            ))
                        }

                    </TableBody>

                </Table>

            </Paper>

        </Container>
    );
}

export default Volunteers;