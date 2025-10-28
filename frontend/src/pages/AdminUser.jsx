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
    </div>
  );
}
