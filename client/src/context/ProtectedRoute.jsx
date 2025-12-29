import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext"
import toast from "react-hot-toast";
import LoaderComp from "../components/LoaderComp";

const ProtectedRoute = ({ children }) => {
    const { user,loading } = useAuth();

    if(loading){
        return <LoaderComp/>
    }

    if (!user) {
        toast.error("Please login to Continue");
        return <Navigate to={'/'} />;
    }

    return children;
}

export { ProtectedRoute }