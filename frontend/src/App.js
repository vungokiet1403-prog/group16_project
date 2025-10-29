import "./App.css";
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { Auth } from "./api";

function NavBar(){
  const nav = useNavigate();
  const logged = !!localStorage.getItem("token");
  const logout = () => { Auth.logout(); nav("/login", {replace:true}); };
  return (
    <nav className="navbar">
      <Link to="/login">Login</Link>
      <Link to="/signup">Signup</Link>
      {logged && <button className="btn" style={{width:120}} onClick={logout}>Logout</button>}
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
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
