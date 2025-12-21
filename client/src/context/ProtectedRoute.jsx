import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext"
import toast from "react-hot-toast";

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();

    if (!user) {
        toast.error("Please login to Continue");
        return <Navigate to={'/'} />;
    }

    return children;
}

export { ProtectedRoute }