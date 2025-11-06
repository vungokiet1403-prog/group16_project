<<<<<<< HEAD
import { useEffect, useState } from "react";
import { Users } from "../api";

export default function AdminUsers(){
  const [items,setItems]=useState([]); const [err,setErr]=useState("");
  const load=()=> Users.list().then(({data})=>setItems(data)).catch(e=>setErr(e?.response?.data?.message||e.message));
  useEffect(()=>{ load(); },[]);
  const del = async (id)=>{ if(!window.confirm("Xóa user này?")) return; await Users.remove(id); load(); };
  return (
    <div style={{maxWidth:720, margin:"24px auto"}}>
      <h3>Quản trị User</h3>
      {err && <div style={{color:"red"}}>{err}</div>}
      <table width="100%" border="1" cellPadding="8">
        <thead><tr><th>Email</th><th>Name</th><th>Role</th><th>Action</th></tr></thead>
        <tbody>
          {items.map(u=>(
            <tr key={u._id || u.id}>
              <td>{u.email}</td><td>{u.name}</td><td>{u.role}</td>
              <td><button onClick={()=>del(u._id || u.id)}>Xóa</button></td>
            </tr>
          ))}
        </tbody>
      </table>
=======

import { useEffect, useMemo, useState } from "react";
import { Users } from "../api";
import getError from "../utils/getError";

export default function AdminUser(){
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = () => {
    setLoading(true); setErr("");
    Users.list()
      .then(r => setItems(r.data))
      .catch(e => setErr(getError(e)))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const filtered = useMemo(() => {
    const k = q.trim().toLowerCase();
    if (!k) return items;
    return items.filter(u =>
      (u.name||"").toLowerCase().includes(k) ||
      (u.email||"").toLowerCase().includes(k) ||
      (u.role||"").toLowerCase().includes(k)
    );
  }, [q, items]);

  const removeUser = async (u) => {
    if (!window.confirm(`Xóa tài khoản ${u.email}?`)) return;
    try{
      await Users.remove(u._id || u.id);
      setItems(prev => prev.filter(x => (x._id||x.id) !== (u._id||u.id)));
    }catch(e){ alert(getError(e)); }
  };

  const Avatar = ({u}) => (
  <div className="avatar">
    {u.avatarUrl
      ? <img loading="lazy" src={u.avatarUrl} alt={u.name||u.email}/>
      : <span>{(u.name||u.email||"?")[0].toUpperCase()}</span>}
  </div>
  );
  return (
    <div className="admin-wrap">
      <div className="admin-card">
        <div className="admin-head">
          <h2>Quản lý người dùng</h2>
          <div className="toolbar">
            <input
              className="input sm" placeholder="Tìm theo tên, email, role…"
              value={q} onChange={e=>setQ(e.target.value)}
            />
            <button className="btn ghost sm" onClick={load}>Refresh</button>
          </div>
        </div>

        {err && <div className="note err">Lỗi: {err}</div>}

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th style={{width:70}}>Avatar</th>
                <th>Name</th>
                <th>Email</th>
                <th style={{width:120}}>Role</th>
                <th style={{width:100}}></th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr><td colSpan={5} className="muted">Đang tải danh sách…</td></tr>
              )}

              {!loading && filtered.length===0 && (
                <tr><td colSpan={5} className="muted">Không có kết quả.</td></tr>
              )}

              {filtered.map(u => (
                <tr key={u._id||u.id}>
                  <td><Avatar u={u}/></td>
                  <td className="name">{u.name||"—"}</td>
                  <td className="email">{u.email}</td>
                  <td>
                    <span className={`tag ${u.role==='admin'?'admin':'user'}`}>
                      {u.role||'user'}
                    </span>
                  </td>
                  <td>
                    <button className="btn danger sm" onClick={()=>removeUser(u)}>
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
>>>>>>> origin/backend
    </div>
  );
}
