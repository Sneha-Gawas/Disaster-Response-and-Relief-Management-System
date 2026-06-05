import {
    Link
} from "react-router-dom";

function Sidebar() {

    return (

        <div
            style={{
                width:
                    "250px",

                background:
                    "#f2f2f2",

                minHeight:
                    "100vh",

                padding:
                    "20px"
            }}
        >

            <h3>
                Navigation
            </h3>

            <ul>

                <li>
                    <Link
                     to="/dashboard"
                    >
                     Dashboard
                    </Link>
                </li>

                <li>
                    <Link
                     to="/earthquakes"
                    >
                     Earthquakes
                    </Link>
                </li>

                <li>
                    <Link
                     to="/hotspots"
                    >
                     Hotspots
                    </Link>
                </li>

                <li>
                    <Link
                     to="/anomalies"
                    >
                     Anomalies
                    </Link>
                </li>

                <li>
                    <Link
                     to="/resources"
                    >
                     Resources
                    </Link>
                </li>

                <li>
                    <Link
                     to="/funds"
                    >
                     Funds
                    </Link>
                </li>

                <li>
                    <Link
                     to="/transactions"
                    >
                     Blockchain
                    </Link>
                </li>
                <li>
    <Link
     to="/profile"
    >
     Profile
    </Link>
</li>

<li>
    <Link
     to="/volunteers"
    >
     Volunteers
    </Link>
</li>

<li>
    <Link
     to="/organizations"
    >
     Organizations
    </Link>
</li>
            </ul>

        </div>
    );
}

export default Sidebar;