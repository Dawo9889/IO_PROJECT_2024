import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function PublicRoute({ element }) {
  const { auth } = useAuth();

  if (auth.user) {
    return <Navigate to="/" replace />;
  }

  return element;
}

export default PublicRoute;
