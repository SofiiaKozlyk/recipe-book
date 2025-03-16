import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    children: ReactNode;
    isAllowed: boolean;
}

function ProtectedRoute({ children, isAllowed }: ProtectedRouteProps) {
    if (!isAllowed) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;