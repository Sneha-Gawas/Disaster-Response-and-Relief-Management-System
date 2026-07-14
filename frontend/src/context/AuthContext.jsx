import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

const AuthContext = createContext();

const decodeToken = (token) => {
    if (!token) return null;

    try {
        const payload = token.split(".")[1];
        if (!payload) return null;

        const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
        return JSON.parse(atob(normalized));
    } catch {
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const savedToken = localStorage.getItem("token");

        if (savedToken) {
            setToken(savedToken);
            setUser(decodeToken(savedToken));
        }
    }, []);

    const login = (jwtToken) => {
        localStorage.setItem("token", jwtToken);
        setToken(jwtToken);
        setUser(decodeToken(jwtToken));
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };

    const role = user?.role?.toUpperCase();

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                login,
                logout,
                isAdmin: role === "ADMIN",
                isNgo: role === "NGO",
                isVolunteer: role === "VOLUNTEER"
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);