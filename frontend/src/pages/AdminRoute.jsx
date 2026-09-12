import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {

    const token = localStorage.getItem("token");

    const storedUser =
        localStorage.getItem("user");


    const user = storedUser
        ? JSON.parse(storedUser)
        : null;


    // =========================
    // NOT LOGGED IN
    // =========================

    if (!token || !user) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }


    // =========================
    // NOT ADMIN
    // =========================

    if (user.role !== "admin") {

        return (
            <Navigate
                to="/"
                replace
            />
        );

    }


    // =========================
    // ADMIN ACCESS
    // =========================

    return children;

}