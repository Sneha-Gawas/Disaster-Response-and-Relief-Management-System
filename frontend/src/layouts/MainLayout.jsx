import Navbar
from "../components/Navbar";

import Sidebar
from "../components/Sidebar";

function MainLayout({
    children
}) {

    return (

        <div>

            <Navbar />

            <div
                style={{
                    display:
                        "flex"
                }}
            >

                <Sidebar />

                <div
                    style={{
                        padding:
                            "20px",

                        width:
                            "100%"
                    }}
                >

                    {children}

                </div>

            </div>

        </div>
    );
}

export default MainLayout;