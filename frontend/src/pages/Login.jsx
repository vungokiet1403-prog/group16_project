import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "../api";


const getErr = e => e?.response?.data?.message || e.message || "Lỗi";

export default function Login(){
  const nav = useNavigate();
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [err,setErr] = useState("");

  const submit = async e=>{
    e.preventDefault(); setErr("");
    try{
      const { data } = await Auth.login({ email, password });
      // chấp nhận {access,refresh,user} hoặc {token,user}
      const access  = data.access || data.token;
      const refresh = data.refresh || data.rt || "";
      if(!access) throw new Error("Thiếu access token từ server");

      localStorage.setItem("access", access);
      if (refresh) localStorage.setItem("refresh", refresh);
      const role = data?.user?.role || "user";
      localStorage.setItem("role", role);
      localStorage.setItem("user", JSON.stringify(data.user || {}));

      nav(role === "admin" ? "/admin" : "/profile", { replace:true });
    }catch(e){ setErr(getErr(e)); }
  };

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={submit}>
        <h2 className="auth-title">Đăng nhập</h2>
        <div className="field">
          <input className="input" type="email" required placeholder="Email"
            value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div className="field">
          <input className="input" type="password" required placeholder="Mật khẩu"
            value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <button className="btn">Login</button>
        {err && <div className="note err">Lỗi: {err}</div>}
      </form>
    </div>
  );
}
