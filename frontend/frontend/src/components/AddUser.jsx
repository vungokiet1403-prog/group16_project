import { useState } from "react";
import { Users } from "../api";

export default function AddUser({ onAdded }) {
  const [f, setF] = useState({ name: "", email: "" });
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await Users.add(f);
      setMsg("Thêm thành công!");
      setF({ name: "", email: "" });
      onAdded?.();
    } catch (e2) {
      setMsg(e2?.response?.data?.message || e2.message);
    }
  };

  return (
    <form onSubmit={submit} style={{display:"grid", gap:8, maxWidth:360}}>
      <h2>Thêm User</h2>
      <input placeholder="Tên" value={f.name}
             onChange={e=>setF({...f, name:e.target.value})} required />
      <input placeholder="Email" type="email" value={f.email}
             onChange={e=>setF({...f, email:e.target.value})} required />
      <button type="submit">Thêm</button>
      {msg && <div style={{color: msg.includes("thành công")?"green":"red"}}>{msg}</div>}
    </form>
  );
}
