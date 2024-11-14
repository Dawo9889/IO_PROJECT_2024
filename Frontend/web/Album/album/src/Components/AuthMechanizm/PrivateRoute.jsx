import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";


function PrivateRoute({ element }) {
  const { auth } = useAuth(); // Uzyskujemy dostęp do stanu logowania z kontekstu

  if (!auth.user) {
    // Jeśli użytkownik nie jest zalogowany, przekieruj na stronę logowania
    return <Navigate to="/login" replace />;
  }

  // Jeśli użytkownik jest zalogowany, wyświetl żądany komponent
  return element;
}

export default PrivateRoute;