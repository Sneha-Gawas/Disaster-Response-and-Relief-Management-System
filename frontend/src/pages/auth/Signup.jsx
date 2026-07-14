import {
    useState
} from "react";

import API
from "../../services/api";

import {
    Link,
    useNavigate
} from "react-router-dom";

import "./Signup.css";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";

function Signup() {

    const navigate =
        useNavigate();

    const [form,
        setForm] =
        useState({

            full_name: "",

            email: "",

            password: "",

            role: "VOLUNTEER"
        });

    const register =
    async (event) => {
        event.preventDefault();

        try {
            await API.post(
                "/signup",
                form
            );

            toast.success("Registration successful!");
            navigate("/login");
        } catch {
            toast.error("Registration failed. Please try again.");
        }
    };

    return (
        <div className="body-container">
            <form onSubmit={register}>
                <h2 className="form-title">Signup</h2>

                <input
                    className="input-field"
                    placeholder="Full Name"
                    value={form.full_name}
                    required
                    onChange={(e) =>
                        setForm({
                            ...form,
                            full_name:
                                e.target.value
                        })
                    }
                />

                <input
                    className="input-field"
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    required
                    onChange={(e) =>
                        setForm({
                            ...form,
                            email:
                                e.target.value
                        })
                    }
                />

                <input
                    className="input-field"
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    required
                    onChange={(e) =>
                        setForm({
                            ...form,
                            password:
                                e.target.value
                        })
                    }
                />

                <select
                    className="input-field"
                    value={form.role}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            role:
                                e.target.value
                        })
                    }
                >
                    <option value="ADMIN">Admin</option>
                    <option value="AUTHORITY">Authority</option>
                    <option value="NGO">NGO</option>
                    <option value="VOLUNTEER">Volunteer</option>
                </select>

                <button className="submit-button" type="submit">Register</button>

                <Link className="login-link" to="/login">Login</Link>
            </form>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </div>
    );
}

export default Signup;