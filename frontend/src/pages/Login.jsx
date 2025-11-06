import { useState } from "react";
<<<<<<< HEAD
=======
import { useNavigate } from "react-router-dom";
>>>>>>> origin/backend
import { Auth } from "../api";
import getError from "../utils/getError";

export default function Login(){
<<<<<<< HEAD
=======
  const nav = useNavigate();
>>>>>>> origin/backend
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [err,setErr] = useState("");
  const [token,setToken] = useState("");

  const submit = async (e)=>{
    e.preventDefault(); setErr(""); setToken("");
    try{
<<<<<<< HEAD
      const {data} = await Auth.login({email,password});
      localStorage.setItem("token", data.token);
      setToken(data.token);           // hiện JWT để chụp ảnh nộp
    }catch(e){ setErr(getError(e)); }
  };

=======
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


>>>>>>> origin/backend
  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={submit}>
        <h2 className="auth-title">Đăng nhập</h2>
        <div className="field">
          <input className="input" placeholder="Email" type="email" required
                 value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div className="field">
<<<<<<< HEAD
          <input className="input" type="password" placeholder="Mật khẩu" required minLength={6}
=======
          <input className="input" type="password" placeholder="Mật khẩu" required minLength={4}
>>>>>>> origin/backend
                 value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <button className="btn">Login</button>

        {err && <div className="note err">Lỗi: {err}</div>}
        {token && (<>
<<<<<<< HEAD
          <div className="note ok">JWT token (chụp ảnh nộp):</div>
=======
          <div className="note ok">JWT token:</div>
>>>>>>> origin/backend
          <textarea className="token" readOnly value={token} />
        </>)}
      </form>
    </div>
  );
}
