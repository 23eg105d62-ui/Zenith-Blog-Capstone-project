import { useAuth } from "../store/authStore";
import { Navigate } from "react-router";

function ProtectedRoute({ children, allowedRoles }) {
    //get user login status from store
    const { loading, currentUser, isAuthenticated, logout } = useAuth();
    //loading state
    if (loading) {
        return <p>Loading...</p>;
    }
    //if user not loggedin
    if (!isAuthenticated) {
        //redirect to Login
        return <Navigate to="/login" replace />;
    }
    //check roles
    if (allowedRoles && !allowedRoles.includes(currentUser?.role)) {
        console.log("first");
        //redirect to Login
        return <Navigate to="/unauthorized" replace state={{ redirectTo: "/" }} />;
    }

    return children;
}

export default ProtectedRoute;