import {

    useEffect,
    useState

} from "react";

import axios from "axios";

import {

    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Typography

} from "@mui/material";

function Earthquakes() {

    const [

        data,

        setData

    ] = useState([]);

    useEffect(() => {

        axios

            .get(
                "http://localhost:8000/earthquakes"
            )

            .then(

                res =>
                setData(
                    res.data
                )
            );

    }, []);

    return (

        <Paper sx={{ p:3 }}>

            <Typography
                variant="h5"
            >

                Earthquake Events

            </Typography>

            <Table>

                <TableHead>

                    <TableRow>

                        <TableCell>
                            Place
                        </TableCell>

                        <TableCell>
                            Magnitude
                        </TableCell>

                    </TableRow>

                </TableHead>

                <TableBody>

                    {

                        data.map(
                            (
                                row,
                                index
                            ) => (

                            <TableRow
                                key={index}
                            >

                                <TableCell>

                                    {
                                        row.place
                                    }

                                </TableCell>

                                <TableCell>

                                    {
                                        row.mag
                                    }

                                </TableCell>

                            </TableRow>
                        ))
                    }

                </TableBody>

            </Table>

        </Paper>
    );
}

export default Earthquakes;