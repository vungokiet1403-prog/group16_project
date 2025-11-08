import { useState } from "react";
import { Auth } from "../api";

export default function ResetPassword(){
  const [token, setToken] = useState("");
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const submit = async e=>{
    e.preventDefault(); setErr(""); setMsg("");
    try{
      const { data } = await Auth.resetByParam(token, pw);
      setMsg(data?.message || "Đổi mật khẩu OK");
    }catch(e){ setErr(e?.response?.data?.message || e.message); }
  };

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={submit}>
        <h2 className="auth-title">Đổi mật khẩu bằng token</h2>
        <div className="field"><input className="input" placeholder="Token"
          value={token} onChange={e=>setToken(e.target.value)} required /></div>
        <div className="field"><input className="input" type="password" placeholder="Mật khẩu mới"
          value={pw} onChange={e=>setPw(e.target.value)} required minLength={4} /></div>
        <button className="btn">Đổi mật khẩu</button>
        {msg && <div className="note ok">{msg}</div>}
        {err && <div className="note err">Lỗi: {err}</div>}
      </form>
    </div>
  );
}
