import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";


function PrivateRoute({ element }) {
  const { auth } = useAuth();

  if (!auth.user) {
    return <Navigate to="/login" replace />;
  }

  return element;
}

export default PrivateRoute;