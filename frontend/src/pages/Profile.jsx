import { useEffect, useState } from "react";
import { Auth } from "../api";

export default function Profile(){
  const [u,setU]=useState(null); const [name,setName]=useState("");
  const [avatarFile,setAvatarFile]=useState(null);
  const [msg,setMsg]=useState("");

  useEffect(()=>{ Auth.me().then(({data})=>{ setU(data); setName(data.name||""); }); },[]);

  const save = async ()=>{
    let avatarUrl = u?.avatarUrl;
    if(avatarFile){
      const up = await Auth.uploadAvatar(avatarFile);
      avatarUrl = up.data.url;
    }
    const {data} = await Auth.updateMe({name, avatarUrl});
    setU(data.user); setMsg("Cập nhật thành công");
  };

  const logout = ()=>{
    localStorage.removeItem("token");
    window.location.href="/login";
  }

  if(!u) return <div style={{padding:24}}>Đang tải...</div>;
  return (
    <div style={{maxWidth:480, margin:"24px auto", display:"grid", gap:12}}>
      <h3>Thông tin cá nhân</h3>
      <img src={u.avatarUrl||"https://via.placeholder.com/120"} alt="" width="120" />
      <input value={name} onChange={e=>setName(e.target.value)} />
      <input type="file" onChange={e=>setAvatarFile(e.target.files[0])} />
      <button onClick={save}>Lưu</button>
      <button onClick={logout}>Đăng xuất</button>
      {msg && <div style={{color:"green"}}>{msg}</div>}
      <div>Email: {u.email}</div>
      <div>Role: {u.role}</div>
    </div>
  );
}


