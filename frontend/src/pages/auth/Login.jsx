import {
    useState
} from "react";

import {
    useNavigate,
    Link
} from "react-router-dom";

import API
from "../../services/api";

import {
    useAuth
} from "../../context/AuthContext";

function Login() {

    const navigate =
        useNavigate();

    const {
        login
    } = useAuth();

    const [email,
        setEmail] =
        useState("");

    const [password,
        setPassword] =
        useState("");

    const handleLogin =
    async () => {

        try {

            const response =
                await API.post(
                    "/login",
                    {
                        email,
                        password
                    }
                );

            login(
                response.data
                .access_token
            );

            navigate(
                "/dashboard"
            );

        } catch {

            alert(
                "Invalid Email or Password"
            );
        }
    };

    return (

        <div>

            <h2>
                Login
            </h2>

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) =>
                    setEmail(
                        e.target.value
                    )
                }
            />

            <br />
            <br />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) =>
                    setPassword(
                        e.target.value
                    )
                }
            />

            <br />
            <br />

            <button
                onClick={
                    handleLogin
                }
            >
                Login
            </button>

            <br />
            <br />

            <Link
                to="/signup"
            >
                Create Account
            </Link>

        </div>
    );
}

export default Login;