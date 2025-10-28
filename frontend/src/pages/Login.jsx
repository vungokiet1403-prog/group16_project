import { useState } from "react";
import { Auth } from "../api";
import getError from "../utils/getError";

export default function Login(){
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [err,setErr] = useState("");
  const [token,setToken] = useState("");

  const submit = async (e)=>{
    e.preventDefault(); setErr(""); setToken("");
    try{
      const {data} = await Auth.login({email,password});
      localStorage.setItem("token", data.token);
      setToken(data.token);           // hiện JWT để chụp ảnh nộp
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
          <input className="input" type="password" placeholder="Mật khẩu" required minLength={6}
                 value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <button className="btn">Login</button>

        {err && <div className="note err">Lỗi: {err}</div>}
        {token && (<>
          <div className="note ok">JWT token (chụp ảnh nộp):</div>
          <textarea className="token" readOnly value={token} />
        </>)}
      </form>
    </div>
  );
}
