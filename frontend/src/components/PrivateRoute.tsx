// src/components/PrivateRoute.tsx
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const token = localStorage.getItem("token"); // check if JWT exists
  return token ? <>{children}</> : <Navigate to="/signin" />;
};

export default PrivateRoute;