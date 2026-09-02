import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const token = localStorage.getItem("token");

        const role = localStorage.getItem("role");

        if (token && role) {

            setUser({
                token,
                role
            });

        }

        setLoading(false);

    }, []);

    const login = (token, role) => {

        localStorage.setItem("token", token);

        localStorage.setItem("role", role);

        setUser({
            token,
            role
        });

    };

    const logout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("role");

        setUser(null);

    };

    return (

        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                loading
            }}
        >
            {children}
        </AuthContext.Provider>

    );
}
