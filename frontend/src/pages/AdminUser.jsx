// src/pages/AdminUser.jsx
import { useEffect, useMemo, useState } from "react";
import { Users } from "../api";
import getError from "../utils/getError";

export default function AdminUser() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // trạng thái sửa
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", role: "user", newPassword: "" });

  const load = () => {
    setLoading(true);
    setErr("");
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
      (u.name || "").toLowerCase().includes(k) ||
      (u.email || "").toLowerCase().includes(k) ||
      (u.role || "").toLowerCase().includes(k)
    );
  }, [q, items]);

  const startEdit = (u) => {
    setEditingId(u._id || u.id);
    setForm({
      name: u.name || "",
      email: u.email || "",
      role: u.role || "user",
      newPassword: ""
    });
  };

  const saveEdit = async (u) => {
    try {
      const id = u._id || u.id;
      const body = {
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role
      };
      // gửi password nếu có (BE chấp nhận 'password' hoặc 'newPassword')
      if (form.newPassword?.trim()) body.password = form.newPassword.trim();

      const { data: updated } = await Users.update(id, body);
      setItems(prev =>
        prev.map(x =>
          String(x._id || x.id) === String(id) ? { ...x, ...updated } : x
        )
      );
      setEditingId(null);
    } catch (e) {
      alert(getError(e));
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: "", email: "", role: "user", newPassword: "" });
  };

  const removeUser = async (u) => {
    if (!window.confirm(`Xóa tài khoản ${u.email}?`)) return;
    try {
      await Users.remove(u._id || u.id);
      setItems(prev => prev.filter(x => (x._id || x.id) !== (u._id || u.id)));
    } catch (e) {
      alert(getError(e));
    }
  };

  const Avatar = ({ u }) => (
    <div className="avatar">
      {u.avatarUrl
        ? <img loading="lazy" src={u.avatarUrl} alt={u.name || u.email} />
        : <span>{(u.name || u.email || "?")[0].toUpperCase()}</span>}
    </div>
  );

  return (
    <div className="admin-wrap">
      <div className="admin-card">
        <div className="admin-head">
          <h2>Quản lý người dùng</h2>
          <div className="toolbar">
            <input
              className="input sm"
              placeholder="Tìm theo tên, email, role…"
              value={q}
              onChange={e => setQ(e.target.value)}
            />
            <button className="btn ghost sm" onClick={load}>Refresh</button>
          </div>
        </div>

        {err && <div className="note err">Lỗi: {err}</div>}

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 70 }}>Avatar</th>
                <th>Name / Email / (đổi mật khẩu)</th>
                <th style={{ width: 140 }}>Role</th>
                <th style={{ width: 160 }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={4} className="muted">Đang tải…</td></tr>}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={4} className="muted">Không có kết quả.</td></tr>
              )}

              {filtered.map(u => {
                const isEdit = editingId === (u._id || u.id);
                return (
                  <tr key={u._id || u.id}>
                    <td><Avatar u={u} /></td>

                    <td>
                      {isEdit ? (
                        <>
                          <input
                            className="input sm"
                            placeholder="Name"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                          />
                          <input
                            className="input sm"
                            placeholder="Email"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                          />
                          <input
                            className="input sm"
                            type="password"
                            placeholder="Mật khẩu mới (tùy chọn)"
                            value={form.newPassword}
                            onChange={e => setForm({ ...form, newPassword: e.target.value })}
                          />
                        </>
                      ) : (
                        <>
                          <div className="name">{u.name || "—"}</div>
                          <div className="email muted">{u.email}</div>
                        </>
                      )}
                    </td>

                    <td>
                      {isEdit ? (
                        <select
                          className="input sm"
                          value={form.role}
                          onChange={e => setForm({ ...form, role: e.target.value })}
                        >
                          <option value="user">user</option>
                          <option value="admin">admin</option>
                        </select>
                      ) : (
                        <span className={`tag ${u.role === "admin" ? "admin" : "user"}`}>
                          {u.role}
                        </span>
                      )}
                    </td>

                    <td>
                      {isEdit ? (
                        <>
                          <button className="btn sm" onClick={() => saveEdit(u)}>Lưu</button>
                          <button className="btn ghost sm" style={{ marginLeft: 8 }} onClick={cancelEdit}>Hủy</button>
                        </>
                      ) : (
                        <>
                          <button className="btn sm" onClick={() => startEdit(u)}>Sửa</button>
                          <button className="btn danger sm" style={{ marginLeft: 8 }} onClick={() => removeUser(u)}>Xóa</button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
