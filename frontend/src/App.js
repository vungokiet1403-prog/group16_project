import "./App.css";
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
<<<<<<< HEAD
import { Auth } from "./api";

function NavBar(){
  const nav = useNavigate();
  const logged = !!localStorage.getItem("token");
  const logout = () => { Auth.logout(); nav("/login", {replace:true}); };
=======
import Profile from "./pages/Profile";
import AdminUser from "./pages/AdminUser";
import ProtectedRoute from "./components/ProtectedRoute";  
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import { Auth } from "./api";


function NavBar(){
  const nav = useNavigate();
  const t = localStorage.getItem("token");
  const logged = !!t;

  // lấy role từ JWT
  let role = "";
  try { role = JSON.parse(atob((t || "").split(".")[1] || ""))?.role || ""; } catch {}
  const isAdmin = role === "admin";

  const logout = () => { Auth.logout(); nav("/login", {replace:true}); };

>>>>>>> origin/backend
  return (
    <nav className="navbar">
      <Link to="/login">Login</Link>
      <Link to="/signup">Signup</Link>
<<<<<<< HEAD
      {logged && <button className="btn" style={{width:120}} onClick={logout}>Logout</button>}
=======
      {logged && <>
        <Link to="/profile">Profile</Link>
        {isAdmin && <Link to="/admin">Admin</Link>}
        <button className="btn" style={{width:120}} onClick={logout}>Logout</button>
      </>}
>>>>>>> origin/backend
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
<<<<<<< HEAD
=======
        <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/reset-password" element={<ResetPassword/>} />
        <Route path="/admin" element={
          <ProtectedRoute roles={["admin"]}>
            <AdminUser/>
          </ProtectedRoute>
        }/>
>>>>>>> origin/backend
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
