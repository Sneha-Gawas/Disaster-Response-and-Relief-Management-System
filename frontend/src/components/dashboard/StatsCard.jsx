import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

function StatsCard({
    title,
    value
}) {

    return (

        <Card
            sx={{
                minWidth: 250
            }}
        >

            <CardContent>

                <Typography
                    variant="h6"
                >
                    {title}
                </Typography>

                <Typography
                    variant="h4"
                >
                    {value}
                </Typography>

            </CardContent>

        </Card>
    );
}

export default StatsCard;