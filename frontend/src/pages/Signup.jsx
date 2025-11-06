import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "../api";
import getError from "../utils/getError";

export default function Signup(){
  const nav = useNavigate();
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [msg,setMsg]=useState("");
  const [err,setErr]=useState("");

  const submit = async (e)=>{
    e.preventDefault(); setErr(""); setMsg("");
    try{
      const {data} = await Auth.signup({name,email,password});
      localStorage.setItem("token", data.token);
      setMsg("Tạo tài khoản thành công ✅");
      setTimeout(()=>nav("/login", {replace:true}), 700); // về Login
    }catch(e){ setErr(getError(e)); }
  };

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={submit}>
        <h2 className="auth-title">Đăng ký</h2>

        <div className="field">
          <input className="input" placeholder="Họ tên"
                 value={name} onChange={e=>setName(e.target.value)} />
        </div>
        <div className="field">
          <input className="input" placeholder="Email" type="email" required
                 value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div className="field">
<<<<<<< HEAD
          <input className="input" type="password" placeholder="Mật khẩu" required minLength={6}
=======
          <input className="input" type="password" placeholder="Mật khẩu" required minLength={5}
>>>>>>> origin/backend
                 value={password} onChange={e=>setPassword(e.target.value)} />
        </div>

        <button className="btn">Sign up</button>

        {msg && <div className="note ok">{msg}</div>}
        {err && <div className="note err">Lỗi: {err}</div>}
      </form>
    </div>
  );
}
