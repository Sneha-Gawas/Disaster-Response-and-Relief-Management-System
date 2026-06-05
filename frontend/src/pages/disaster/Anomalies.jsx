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
    Typography
} from "@mui/material";

function Anomalies() {

    const [

        data,

        setData

    ] = useState([]);

    useEffect(() => {

        axios

            .get(
                "http://localhost:8000/anomalies"
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

                Anomaly Detection

            </Typography>

            <Table>

                <TableHead>

                    <TableRow>

                        <TableCell>
                            Place
                        </TableCell>

                        <TableCell>
                            Anomaly
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
                                    {row.place}
                                </TableCell>

                                <TableCell>
                                    {row.anomaly}
                                </TableCell>

                            </TableRow>
                        ))
                    }

                </TableBody>

            </Table>

        </Paper>
    );
}

export default Anomalies;