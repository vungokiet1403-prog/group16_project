import { useState } from "react";
import { Auth } from "../api";
import getError from "../utils/getError";

export default function ForgotPassword(){
  const [email,setEmail] = useState("");
  const [msg,setMsg] = useState("");
  const [err,setErr] = useState("");
  const [token,setToken] = useState("");

  const submit = async (e)=>{
    e.preventDefault(); setErr(""); setMsg(""); setToken("");
    try{
      const {data} = await Auth.forgot(email);
      setMsg("Đã tạo token. Dùng token bên dưới để đổi mật khẩu.");
      setToken(data.token); 
    }catch(e){ setErr(getError(e)); }
  };

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={submit}>
        <h2 className="auth-title">Quên mật khẩu</h2>
        <div className="field">
          <input className="input" placeholder="Email" type="email"
                 value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <button className="btn">Gửi token</button>
        {msg && <div className="note ok">{msg}</div>}
        {err && <div className="note err">Lỗi: {err}</div>}
        {token && (<><div className="note ok">Reset token:</div><textarea className="token" readOnly value={token}/></>)}
      </form>
    </div>
  );
}
