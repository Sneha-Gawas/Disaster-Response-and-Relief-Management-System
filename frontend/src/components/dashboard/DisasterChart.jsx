import {
    Bar
} from "react-chartjs-2";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function DisasterChart({

    earthquakes,

    hotspots,

    anomalies

}) {

    const data = {

        labels: [

            "Earthquakes",

            "Hotspots",

            "Anomalies"
        ],

        datasets: [

            {

                label:
                    "Count",

                data: [

                    earthquakes,

                    hotspots,

                    anomalies
                ]
            }
        ]
    };

    return (

        <Bar
            data={data}
        />

    );
}

export default DisasterChart;