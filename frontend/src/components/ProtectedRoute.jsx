import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p className="py-16 text-center text-slate-500">Chargement...</p>;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}
