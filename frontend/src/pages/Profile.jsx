// src/pages/Profile.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "../api";
import getError from "../utils/getError";

export default function Profile() {
  const nav = useNavigate();
  const [u, setU] = useState(null);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  // preview ảnh tạm
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await Auth.me();
        setU(data);
        setName(data.name || "");
      } catch (e) {
        setErr(getError(e));
        if (e?.response?.status === 401) nav("/login", { replace: true });
      }
    })();
  }, [nav]);

  const save = async (e) => {
    e.preventDefault();
    if (!u) return;
    setErr("");
    setMsg("");
    setSaving(true);
    try {
      let avatarUrl = u.avatarUrl;
      if (file) {
        const { data } = await Auth.uploadAvatar(file); // { url }
        avatarUrl = data.url;
      }
      const body = { name: name.trim() };
      if (avatarUrl) body.avatarUrl = avatarUrl;
      if (password.trim()) body.password = password.trim();

      await Auth.updateMe(body);

      // load lại thông tin mới
      const me = await Auth.me();
      setU(me.data);
      setPassword("");
      setFile(null);
      setMsg("Cập nhật thành công ✅");
    } catch (e) {
      setErr(getError(e));
    } finally {
      setSaving(false);
    }
  };

  if (!u) {
    return (
      <div className="auth-wrap">
        <div className="auth-card">Đang tải…</div>
      </div>
    );
  }

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={save}>
        <h2 className="auth-title">Hồ sơ</h2>

        <div style={{ display: "grid", placeItems: "center", marginBottom: 12 }}>
          <img
            src={preview || u.avatarUrl || "https://i.pravatar.cc/120"}
            alt="avatar"
            style={{ width: 120, height: 120, borderRadius: 60, objectFit: "cover", border: "1px solid #ffffff22" }}
          />
        </div>

        <div className="field">
          <input
            className="input"
            placeholder="Họ tên"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="field">
          <input className="input" value={u.email} readOnly />
        </div>

        <div className="field">
          <input
            className="input"
            type="password"
            placeholder="Đổi mật khẩu (tùy chọn)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={4}
          />
        </div>

        <div className="field">
          <input
            className="input"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>

        <button className="btn" disabled={saving}>
          {saving ? "Đang lưu…" : "Lưu"}
        </button>

        {msg && <div className="note ok">{msg}</div>}
        {err && <div className="note err">Lỗi: {err}</div>}
      </form>
    </div>
  );
}
