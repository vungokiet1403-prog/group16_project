// frontend/src/pages/ResetPassword.jsx
import { useState } from "react";
import { Auth } from "../api";
import getError from "../utils/getError";

export default function ResetPassword(){
  const [token,setToken] = useState("");
  const [pw,setPw] = useState("");
  const [msg,setMsg] = useState("");
  const [err,setErr] = useState("");

  const submit = async (e)=>{
    e.preventDefault(); setErr(""); setMsg("");
    try{
      await Auth.reset(token, pw);
      setMsg("Đổi mật khẩu thành công ✅");
      setToken(""); setPw("");
    }catch(e){ setErr(getError(e)); }
  };

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={submit}>
        <h2 className="auth-title">Đổi mật khẩu bằng token</h2>
        <div className="field"><input className="input" placeholder="Token" value={token} onChange={e=>setToken(e.target.value)} /></div>
        <div className="field"><input className="input" type="password" placeholder="Mật khẩu mới" value={pw} onChange={e=>setPw(e.target.value)} /></div>
        <button className="btn">Đổi mật khẩu</button>
        {msg && <div className="note ok">{msg}</div>}
        {err && <div className="note err">Lỗi: {err}</div>}
      </form>
    </div>
  );
}
