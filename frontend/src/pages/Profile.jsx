import { useEffect, useState } from "react";
import { Auth } from "../api";
import getError from "../utils/getError";
import { useNavigate } from "react-router-dom";

export default function Profile(){
  const nav = useNavigate();
  const [u,setU] = useState(null);
  const [name,setName] = useState("");
  const [password,setPassword] = useState("");
  const [avatarFile,setAvatarFile] = useState(null);
  const [msg,setMsg] = useState(""); const [err,setErr] = useState("");

  useEffect(()=>{ (async()=>{
    try{
      const {data} = await Auth.me();
      setU(data); setName(data.name || "");
    }catch(e){
      setErr(getError(e));
      if (e?.response?.status === 401) nav("/login");
    }
  })(); }, [nav]);

  const save = async (e)=>{
    e.preventDefault(); setErr(""); setMsg("");
    try{
      let avatarUrl = u?.avatarUrl;
      if (avatarFile){
        const up = await Auth.uploadAvatar(avatarFile);
        avatarUrl = up.data.url;
      }
      await Auth.updateMe({ name, ...(password?{password}:{}), ...(avatarUrl?{avatarUrl}:{}) });
      setMsg("Cập nhật thành công ✅");
      const {data} = await Auth.me(); setU(data); setPassword(""); setAvatarFile(null);
    }catch(e){ setErr(getError(e)); }
  };

  if(!u) return <div className="auth-wrap"><div className="auth-card">Đang tải...</div></div>;

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={save}>
        <h2 className="auth-title">Hồ sơ</h2>

        <div className="center">
          <img src={u.avatarUrl || "https://i.pravatar.cc/120"} alt="" style={{width:120,height:120,borderRadius:60}}/>
        </div>

        <div className="field"><input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="Họ tên"/></div>
        <div className="field"><input className="input" value={u.email} readOnly/></div>
        <div className="field"><input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Đổi mật khẩu (tuỳ chọn)" /></div>
        <div className="field"><input className="input" type="file" accept="image/*" onChange={e=>setAvatarFile(e.target.files?.[0]||null)} /></div>

        <button className="btn">Lưu</button>
        {msg && <div className="note ok">{msg}</div>}
        {err && <div className="note err">Lỗi: {err}</div>}
      </form>
    </div>
  );
}
