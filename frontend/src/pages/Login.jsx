import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "../api";
import getError from "../utils/getError";

export default function Login(){
  const nav = useNavigate();
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [err,setErr] = useState("");
  const [token,setToken] = useState("");

  const submit = async (e)=>{
    e.preventDefault(); setErr(""); setToken("");
    try{
      const { data } = await Auth.login({ email, password });
      // lưu token + role
      localStorage.setItem("token", data.token);
      localStorage.setItem("role",  data?.user?.role || "user");

      setToken(data.token); // vẫn hiện JWT để chụp ảnh nếu cần

      // ➜ điều hướng theo role
      const role = data?.user?.role || "user";
      if (role === "admin") nav("/admin", { replace:true });
      else nav("/profile", { replace:true });
    }catch(e){ setErr(getError(e)); }
  };


  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={submit}>
        <h2 className="auth-title">Đăng nhập</h2>
        <div className="field">
          <input className="input" placeholder="Email" type="email" required
                 value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div className="field">
          <input className="input" type="password" placeholder="Mật khẩu" required minLength={4}
                 value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <button className="btn">Login</button>

        {err && <div className="note err">Lỗi: {err}</div>}
        {token && (<>
          <div className="note ok">JWT token:</div>
          <textarea className="token" readOnly value={token} />
        </>)}
      </form>
    </div>
  );
}
