import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, roles }) {
  const access = localStorage.getItem("access");
  if (!access) return <Navigate to="/login" replace />;

  let role = localStorage.getItem("role") || "";
  if (!role) {
    try {
      const payload = JSON.parse(
        atob((access.split(".")[1] || "").replace(/-/g, "+").replace(/_/g, "/"))
      );
      role = payload?.role || "";
    } catch {}
  }
  if (roles?.length && !roles.includes(role)) return <Navigate to="/profile" replace />;
  return children;
}
