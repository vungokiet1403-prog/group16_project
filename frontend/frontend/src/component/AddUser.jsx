import { useState } from "react";
import { api } from "../api";

export default function AddUser({ onAdded }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Name không được để trống");
    if (!/^\S+@\S+\.\S+$/.test(email)) return alert("Email không hợp lệ");

    try {
      setLoading(true);
      const res = await api.post("/users", { name, email });
      onAdded?.(res.data);
      setName(""); setEmail("");
    } catch (err) {
      alert(err?.response?.data?.message || "Lỗi khi thêm user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display:"grid", gridTemplateColumns:"160px 240px auto", gap:8, marginBottom:16 }}>
      <input placeholder="Name"  value={name}  onChange={e=>setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <button type="submit" disabled={loading}>{loading ? "Đang thêm..." : "Thêm"}</button>
    </form>
  );
}
