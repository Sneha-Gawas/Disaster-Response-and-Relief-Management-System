import {
    useAuth
} from "../context/AuthContext";

function Navbar() {

    const {
        logout
    } = useAuth();

    return (

        <div
            style={{
                display:
                    "flex",

                justifyContent:
                    "space-between",

                alignItems:
                    "center",

                background:
                    "#1565c0",

                color:
                    "white",

                padding:
                    "15px"
            }}
        >

            <h2>
                AI Blockchain Disaster Response
            </h2>

            <button
                onClick={
                    logout
                }
            >
                Logout
            </button>

        </div>
    );
}

export default Navbar;