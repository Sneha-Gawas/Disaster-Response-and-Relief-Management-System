import {
    useState
} from "react";

import {
    useNavigate,
    Link
} from "react-router-dom";

import API
from "../../services/api";

import "./Login.css";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";

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
    async (event) => {
        event.preventDefault();

        try {
            const response = await API.post(
                "/login",
                {
                    email,
                    password
                }
            );

            login(response.data.access_token);
            toast.success("Login successful!");
            navigate("/dashboard");
        } catch {
            toast.error("Invalid email or password");
        }
    };

    return (
        <div className="Login">
            <form className="LoginForm" onSubmit={handleLogin}>
                <h2>Login</h2>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit">Login</button>
                <Link to="/signup">Create Account</Link>
            </form>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </div>
    );
}

export default Login;