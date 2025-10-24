import { useEffect, useState } from "react";
import { Users } from "../api";

export default function UserList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // edit state
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "" });
  const [msg, setMsg] = useState("");

  const load = () => {
    setLoading(true);
    setErr("");
    Users.list()
      .then(res => setItems(res.data))
      .catch(e => setErr(e?.response?.data?.message || e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const startEdit = (u) => {
    setEditingId(u._id || u.id);
    setEditForm({ name: u.name ?? "", email: u.email ?? "" });
    setMsg("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: "", email: "" });
  };

  const saveEdit = async () => {
    try {
      const id = editingId;
      await Users.update(id, editForm);
      setMsg("Cập nhật thành công!");
      cancelEdit();
      load();
    } catch (e) {
      setMsg(e?.response?.data?.message || e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa user này?")) return;
    try {
      await Users.remove(id);
      setItems(items.filter(u => (u._id || u.id) !== id));
    } catch (e) {
      alert(e?.response?.data?.message || e.message);
    }
  };

  if (loading) return <p>Đang tải...</p>;
  if (err) return <p style={{color:"red"}}>Lỗi: {err}</p>;

  return (
    <div style={{marginTop:20, maxWidth:600}}>
      <h2>Danh sách User</h2>
      {msg && <div style={{color: msg.includes("thành công")?"green":"red"}}>{msg}</div>}
      <ul style={{listStyle:"disc", paddingLeft:20}}>
        {items.map(u => {
          const id = u._id || u.id;
          const isEditing = editingId === id;
          return (
            <li key={id} style={{marginBottom:8}}>
              {isEditing ? (
                <span>
                  <input
                    value={editForm.name}
                    onChange={e=>setEditForm({...editForm, name:e.target.value})}
                    placeholder="Tên" style={{marginRight:8}}
                  />
                  <input
                    value={editForm.email}
                    onChange={e=>setEditForm({...editForm, email:e.target.value})}
                    placeholder="Email" style={{marginRight:8}}
                  />
                  <button onClick={saveEdit} style={{marginRight:6}}>Lưu</button>
                  <button onClick={cancelEdit}>Hủy</button>
                </span>
              ) : (
                <span>
                  {u.name} — {u.email}{" "}
                  <button onClick={() => startEdit(u)} style={{marginLeft:8}}>Sửa</button>
                  <button onClick={() => handleDelete(id)} style={{marginLeft:6}}>Xóa</button>
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
