import {
    useState
} from "react";

import API
from "../../services/api";

import {
    Link
} from "react-router-dom";

function Signup() {

    const [form,
        setForm] =
        useState({

            full_name: "",

            email: "",

            password: "",

            role: "VOLUNTEER"
        });

    const register =
    async () => {

        try {

            await API.post(
                "/signup",
                form
            );

            alert(
                "Registration Successful"
            );

        } catch {

            alert(
                "Registration Failed"
            );
        }
    };

    return (

        <div>

            <h2>
                Signup
            </h2>

            <input
                placeholder="Full Name"
                onChange={(e) =>
                    setForm({
                        ...form,
                        full_name:
                            e.target.value
                    })
                }
            />

            <br />
            <br />

            <input
                placeholder="Email"
                onChange={(e) =>
                    setForm({
                        ...form,
                        email:
                            e.target.value
                    })
                }
            />

            <br />
            <br />

            <input
                type="password"
                placeholder="Password"
                onChange={(e) =>
                    setForm({
                        ...form,
                        password:
                            e.target.value
                    })
                }
            />

            <br />
            <br />

            <select
                onChange={(e) =>
                    setForm({
                        ...form,
                        role:
                            e.target.value
                    })
                }
            >

                <option value="ADMIN">
                    Admin
                </option>

                <option value="AUTHORITY">
                    Authority
                </option>

                <option value="NGO">
                    NGO
                </option>

                <option value="VOLUNTEER">
                    Volunteer
                </option>

            </select>

            <br />
            <br />

            <button
                onClick={
                    register
                }
            >
                Register
            </button>

            <br />
            <br />

            <Link
                to="/login"
            >
                Login
            </Link>

        </div>
    );
}

export default Signup;