import "./App.css";
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import AdminUser from "./pages/AdminUser";
import ProtectedRoute from "./components/ProtectedRoute";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import { Auth } from "./api";

function NavBar(){
  const nav = useNavigate();
  const access = localStorage.getItem("access");          // ✅ dùng access
  const logged = !!access;

  let role = localStorage.getItem("role") || "";
  if (!role) {
    try { role = JSON.parse(atob((access || "").split(".")[1] || ""))?.role || ""; } catch {}
  }
  const isAdmin = role === "admin";

  const logout = async () => {
    try { await Auth.logout(); } catch {}
    localStorage.clear();                                  // ✅ quan trọng
    nav("/login", { replace:true });
  };

  return (
    <nav className="navbar">
      <Link to="/login">Login</Link>
      <Link to="/signup">Signup</Link>
      <Link to="/forgot-password">Forgot</Link>
      <Link to="/reset-password">Reset</Link>
      {logged && <>
        <Link to="/profile">Profile</Link>
        {isAdmin && <Link to="/admin">Admin</Link>}
        <button className="btn" style={{width:120}} onClick={logout}>Logout</button>
      </>}
    </nav>
  );
}

export default function App(){
  return (
    <BrowserRouter>
      <NavBar/>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/reset-password" element={<ResetPassword/>} />
        <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>} />
        <Route path="/admin" element={
          <ProtectedRoute roles={["admin"]}>
            <AdminUser/>
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
