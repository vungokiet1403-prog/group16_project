import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, roles }) {
  const t = localStorage.getItem("token");
  if (!t) return <Navigate to="/login" replace />;

  if (roles?.length) {
    let role = localStorage.getItem("role") || "";
    if (!role) { 
      try { role = JSON.parse(atob((t.split(".")[1]||"").replace(/-/g,'+').replace(/_/g,'/')))?.role || ""; } catch {}
    }
    if (!roles.includes(role)) return <Navigate to="/profile" replace />;
  }
  return children;
}
