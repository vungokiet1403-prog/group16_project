import { useState } from "react";
import axios from "axios";

export default function AddUser({ onAdded }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Name không được để trống");
    if (!/\S+@\S+\.\S+/.test(email)) return alert("Email không hợp lệ");
    await axios.post("http://localhost:3000/users", { name, email });
    setName(""); setEmail(""); onAdded?.();
  };

  return (
    <form onSubmit={submit} style={{ display:"flex", gap:8, marginBottom:16 }}>
      <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <button type="submit">Thêm</button>
    </form>
  );
}