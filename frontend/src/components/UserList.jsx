import { useEffect, useState } from "react";
import { Users } from "../api";

export default function UserList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // edit state
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "" });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [msg, setMsg] = useState("");

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await Users.list();
      setItems(res.data || []);
    } catch (e) {
      setErr(e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const startEdit = (u) => {
    setEditingId(u._id || u.id);
    setEditForm({ name: u.name || "", email: u.email || "" });
    setMsg("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: "", email: "" });
    setSaving(false);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    if (!editForm.name.trim() || !editForm.email.trim()) {
      setMsg("Tên và email là bắt buộc");
      return;
    }
    setSaving(true);
    setMsg("");
    try {
      const res = await Users.update(editingId, {
        name: editForm.name.trim(),
        email: editForm.email.trim(),
      });

      // optimistic update
      const updated = res.data;
      setItems((prev) =>
        prev.map((x) => ( (x._id || x.id) === editingId ? updated : x ))
      );
      setMsg("Cập nhật thành công!");
      cancelEdit();
    } catch (e) {
      setMsg(e?.response?.data?.message || e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa user này?")) return;
    setDeletingId(id);
    setMsg("");
    try {
      await Users.remove(id);
      setItems((prev) => prev.filter((u) => (u._id || u.id) !== id));
    } catch (e) {
      setMsg(e?.response?.data?.message || e.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <p>Đang tải...</p>;
  if (err) return <p style={{ color: "red" }}>Lỗi: {err}</p>;

  return (
    <div style={{ marginTop: 20, maxWidth: 640 }}>
      <h2>Danh sách User</h2>

      {msg && (
        <div
          style={{
            color: msg.includes("thành công") ? "green" : "red",
            marginBottom: 10,
          }}
        >
          {msg}
        </div>
      )}

      <ul style={{ listStyle: "disc", paddingLeft: 20 }}>
        {items.map((u) => {
          const id = u._id || u.id;
          const isEditing = editingId === id;
          return (
            <li key={id} style={{ marginBottom: 10 }}>
              {isEditing ? (
                <>
                  <input
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    placeholder="Tên"
                    style={{ marginRight: 8 }}
                    disabled={saving}
                  />
                  <input
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                    placeholder="Email"
                    style={{ marginRight: 8 }}
                    disabled={saving}
                  />
                  <button onClick={saveEdit} disabled={saving}>
                    {saving ? "Đang lưu..." : "Lưu"}
                  </button>
                  <button onClick={cancelEdit} disabled={saving} style={{ marginLeft: 6 }}>
                    Hủy
                  </button>
                </>
              ) : (
                <>
                  {u.name} — {u.email}
                  <button onClick={() => startEdit(u)} style={{ marginLeft: 8 }}>
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(id)}
                    style={{ marginLeft: 6 }}
                    disabled={deletingId === id}
                  >
                    {deletingId === id ? "Đang xóa..." : "Xóa"}
                  </button>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}