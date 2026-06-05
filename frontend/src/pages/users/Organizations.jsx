import {
    useEffect,
    useState
} from "react";

import axios from "axios";

import {
    Container,
    Paper,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody
} from "@mui/material";

function Organizations() {

    const [
        organizations,
        setOrganizations
    ] = useState([]);

    useEffect(() => {

        axios
            .get(
                "http://localhost:8000/organizations"
            )
            .then(
                res =>
                setOrganizations(
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
                    Organizations
                </Typography>

                <Table>

                    <TableHead>

                        <TableRow>

                            <TableCell>
                                Name
                            </TableCell>

                            <TableCell>
                                Location
                            </TableCell>

                            <TableCell>
                                Contact
                            </TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {
                            organizations.map(
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
                                            row.location
                                        }
                                    </TableCell>

                                    <TableCell>
                                        {
                                            row.contact
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

export default Organizations;